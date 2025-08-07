import { Button, Divider } from "@mui/material";
import { Circle, Hand, MapPin, Navigation, Plus, Redo, Square, Undo, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useFormContext } from "react-hook-form";
import type { ClientSite } from "../forms/add_client_site/types";

interface Geofence {
  id: number;
  name: string;
  polygon?: any;
  circle?: any;
  type: "polygon" | "circle";
  data?: any;
}

interface GeofenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "site" | "post";
  sitePostIndex?: number;
  title?: string;
}

type ToolType = "pan" | "circle" | "polygon" | "navigation" | "undo" | "redo";

interface LatLng {
  lat: number;
  lng: number;
}

declare global {
  interface Window {
    L: any;
  }
}

const GeofenceModal: React.FC<GeofenceModalProps> = ({ isOpen, onClose, mode = "site", sitePostIndex = 0, title }) => {
  const [selectedTool, setSelectedTool] = useState<ToolType>("pan");
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [currentGeofence, setCurrentGeofence] = useState<Geofence | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const drawLayerRef = useRef<any>(null);
  const currentDrawingRef = useRef<any>(null);

  const { setValue, watch } = useFormContext<ClientSite>();

  const getModalTitle = () => {
    if (title) return title;
    if (mode === "post") return `Mark Post Geofence - Site Post ${sitePostIndex + 1}`;
    return "Mark Geofence";
  };

  const getButtonText = () => {
    if (mode === "post") return "ADD POST GEOFENCE";
    return "ADD THIS GEOFENCE";
  };

  useEffect(() => {
    if (!isOpen || !mapRef.current || mapInstanceRef.current) return;

    const initializeMap = (): void => {
      let initialCenter: [number, number] = [28.6139, 77.209];

      if (mode === "site") {
        const lat = watch("geoLocation.coordinates.latitude");
        const lng = watch("geoLocation.coordinates.longitude");
        if (lat && lng && lat !== 0 && lng !== 0) {
          initialCenter = [lat, lng];
        }
      } else if (mode === "post") {
        const siteLat = watch("geoLocation.coordinates.latitude");
        const siteLng = watch("geoLocation.coordinates.longitude");
        if (siteLat && siteLng && siteLat !== 0 && siteLng !== 0) {
          initialCenter = [siteLat, siteLng];
        }
      }

      mapInstanceRef.current = window.L.map(mapRef.current, {
        center: initialCenter,
        zoom: 16,
        zoomControl: true,
        attributionControl: false,
      });

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      drawLayerRef.current = window.L.layerGroup().addTo(mapInstanceRef.current);
    };

    if (typeof window.L === "undefined") {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = initializeMap;
      document.body.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, mode, watch]);

  const handleToolSelect = (tool: ToolType): void => {
    // Prevent drawing if a geofence already exists
    if (isDrawingMode || currentGeofence) return;

    setSelectedTool(tool);

    if (tool === "polygon") {
      setIsDrawingMode(true);
      enablePolygonDrawing();
    } else if (tool === "circle") {
      setIsDrawingMode(true);
      enableCircleDrawing();
    } else {
      setIsDrawingMode(false);
      disableDrawingMode();
    }
  };

  const enablePolygonDrawing = (): void => {
    if (!mapInstanceRef.current || currentGeofence) return;

    let isDrawing = false;
    let polygonPoints: LatLng[] = [];

    const handleClick = (e: any): void => {
      if (currentGeofence) return; // Prevent drawing if geofence exists
      if (!isDrawing) {
        isDrawing = true;
        polygonPoints = [e.latlng];

        currentDrawingRef.current = window.L.polygon([e.latlng], {
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.15,
          weight: 2,
          dashArray: "8, 4",
        }).addTo(drawLayerRef.current);
      } else {
        polygonPoints.push(e.latlng);
        currentDrawingRef.current.setLatLngs(polygonPoints);
      }
    };

    const handleDoubleClick = (): void => {
      if (currentGeofence) return; // Prevent drawing if geofence exists
      if (isDrawing && polygonPoints.length >= 3) {
        isDrawing = false;
        currentDrawingRef.current.setStyle({
          fillOpacity: 0.25,
          dashArray: null,
        });

        const geofenceData = {
          type: "polygon",
          coordinates: polygonPoints.map((point) => ({ lat: point.lat, lng: point.lng })),
        };

        const geofenceName = mode === "post" ? `Post ${sitePostIndex + 1} Polygon Geofence` : `Polygon Geofence`;

        const newGeofence: Geofence = {
          id: Date.now(),
          name: geofenceName,
          polygon: currentDrawingRef.current,
          type: "polygon",
          data: geofenceData,
        };

        setCurrentGeofence(newGeofence);
        addGeofenceMarkers(newGeofence, polygonPoints[0]);

        polygonPoints = [];
        currentDrawingRef.current = null;
        setIsDrawingMode(false);
        setSelectedTool("pan");
      }
    };

    mapInstanceRef.current.on("click", handleClick);
    mapInstanceRef.current.on("dblclick", handleDoubleClick);
    mapInstanceRef.current.getContainer().style.cursor = "crosshair";

    mapInstanceRef.current._drawingHandlers = { handleClick, handleDoubleClick };
  };

  const enableCircleDrawing = (): void => {
    if (!mapInstanceRef.current || currentGeofence) return;

    let isDrawing = false;
    let centerPoint: LatLng | null = null;

    const handleClick = (e: any): void => {
      if (currentGeofence) return; // Prevent drawing if geofence exists
      if (!isDrawing) {
        isDrawing = true;
        centerPoint = e.latlng;

        currentDrawingRef.current = window.L.circle(e.latlng, {
          radius: 50,
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.15,
          weight: 2,
          dashArray: "8, 4",
        }).addTo(drawLayerRef.current);
      } else {
        if (currentGeofence) return; // Prevent drawing if geofence exists (double check)
        const distance = mapInstanceRef.current.distance(centerPoint, e.latlng);
        currentDrawingRef.current.setRadius(distance);
        currentDrawingRef.current.setStyle({
          fillOpacity: 0.25,
          dashArray: null,
        });

        const geofenceData = {
          type: "circle",
          center: { lat: centerPoint!.lat, lng: centerPoint!.lng },
          radius: distance,
        };

        const geofenceName = mode === "post" ? `Post ${sitePostIndex + 1} Circle Geofence` : `Circle Geofence`;

        const newGeofence: Geofence = {
          id: Date.now(),
          name: geofenceName,
          circle: currentDrawingRef.current,
          type: "circle",
          data: geofenceData,
        };

        setCurrentGeofence(newGeofence);
        addGeofenceMarkers(newGeofence, centerPoint!);

        isDrawing = false;
        centerPoint = null;
        currentDrawingRef.current = null;
        setIsDrawingMode(false);
        setSelectedTool("pan");
        disableDrawingMode(); // Remove drawing handlers after geofence is set
      }
    };

    const handleMouseMove = (e: any): void => {
      if (isDrawing && centerPoint && currentDrawingRef.current && !currentGeofence) {
        const distance = mapInstanceRef.current.distance(centerPoint, e.latlng);
        currentDrawingRef.current.setRadius(distance);
      }
    };

    mapInstanceRef.current.on("click", handleClick);
    mapInstanceRef.current.on("mousemove", handleMouseMove);
    mapInstanceRef.current.getContainer().style.cursor = "crosshair";

    mapInstanceRef.current._drawingHandlers = { handleClick, handleMouseMove };
  };

  const disableDrawingMode = (): void => {
    if (!mapInstanceRef.current) return;

    if (mapInstanceRef.current._drawingHandlers) {
      mapInstanceRef.current.off("click", mapInstanceRef.current._drawingHandlers.handleClick);
      mapInstanceRef.current.off("dblclick", mapInstanceRef.current._drawingHandlers.handleDoubleClick);
      mapInstanceRef.current.off("mousemove", mapInstanceRef.current._drawingHandlers.handleMouseMove);
      delete mapInstanceRef.current._drawingHandlers;
    }

    mapInstanceRef.current.getContainer().style.cursor = "";

    if (currentDrawingRef.current) {
      drawLayerRef.current.removeLayer(currentDrawingRef.current);
      currentDrawingRef.current = null;
    }
  };

  const addGeofenceMarkers = (geofence: Geofence, position: LatLng): void => {
    const numberIcon = window.L.divIcon({
      html: `<div class="bg-[#2A77D5] text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">1</div>`,
      iconSize: [28, 28] as [number, number],
      iconAnchor: [14, 14] as [number, number],
      className: "geofence-number",
    });

    window.L.marker([position.lat, position.lng] as [number, number], { icon: numberIcon }).addTo(drawLayerRef.current);

    const labelIcon = window.L.divIcon({
      html: `<div class="bg-white px-3 py-1 rounded-lg shadow-lg text-sm font-semibold border border-gray-200">${geofence.name}</div>`,
      iconSize: [120, 30] as [number, number],
      iconAnchor: [0, 15] as [number, number],
      className: "geofence-label",
    });

    window.L.marker([position.lat + 0.0003, position.lng + 0.0003] as [number, number], { icon: labelIcon }).addTo(
      drawLayerRef.current
    );
  };

  const handleAddGeofence = (): void => {
    if (currentGeofence) {
      setGeofences([currentGeofence]); // Always only one geofence

      if (mode === "site") {
        const geofenceType = currentGeofence.type === "circle" ? "Circular Geofence" : "Polygon Geofence";
        setValue("geoFencing.type", geofenceType, { shouldDirty: true, shouldValidate: true });

        if (currentGeofence.data) {
          if (currentGeofence.type === "circle") {
            setValue("geoLocation.coordinates.latitude", currentGeofence.data.center.lat, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setValue("geoLocation.coordinates.longitude", currentGeofence.data.center.lng, {
              shouldDirty: true,
              shouldValidate: true,
            });
          } else if (currentGeofence.type === "polygon" && currentGeofence.data.coordinates.length > 0) {
            setValue("geoLocation.coordinates.latitude", currentGeofence.data.coordinates[0].lat, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setValue("geoLocation.coordinates.longitude", currentGeofence.data.coordinates[0].lng, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }
        }
      } else if (mode === "post") {
        const geofenceType = currentGeofence.type === "circle" ? "Circular Geofence" : "Polygon Geofence";
        setValue(`sitePosts.${sitePostIndex}.geoFenceType`, geofenceType, { shouldDirty: true, shouldValidate: true });
      }

      setCurrentGeofence(null);
      onClose();
    }
  };

  const handleClearGeofence = (): void => {
    if (currentGeofence) {
      if (currentGeofence.polygon) {
        drawLayerRef.current.removeLayer(currentGeofence.polygon);
      }
      if (currentGeofence.circle) {
        drawLayerRef.current.removeLayer(currentGeofence.circle);
      }

      drawLayerRef.current.clearLayers();
      setCurrentGeofence(null);
      setGeofences([]);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        zIndex: 99999,
      }}
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" style={{ zIndex: 99998 }} />

      <div
        className="relative bg-white rounded-xl shadow-2xl w-[90vw] h-[90vh] flex flex-col overflow-hidden"
        style={{ zIndex: 99999 }}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-white">
          <h2 className="text-2xl font-semibold text-[#2A77D5]">{getModalTitle()}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            type="button"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <Divider sx={{ mb: "20px", mx: "20px" }} />
        <div className="absolute flex items-center justify-between px-4 py-3 top-22 left-16 z-20">
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-white rounded-lg border border-gray-300 shadow-sm">
              <button
                onClick={handleClearGeofence}
                disabled={!currentGeofence && geofences.length === 0}
                className={`p-3 border-r border-gray-300 transition-colors duration-200 rounded-l-lg ${
                  !currentGeofence && geofences.length === 0
                    ? "text-gray-400 cursor-not-allowed bg-gray-50"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Clear Geofence"
                type="button"
              >
                <Undo className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleToolSelect("redo")}
                className="p-3 hover:bg-gray-100 text-gray-700 transition-colors duration-200 rounded-r-lg"
                title="Redo"
                type="button"
                disabled
              >
                <Redo className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center bg-white rounded-lg border border-gray-300 shadow-sm">
              <button
                onClick={() => handleToolSelect("pan")}
                className={`p-3 border-r border-gray-300 transition-colors duration-200 rounded-l-lg ${
                  selectedTool === "pan"
                    ? "bg-blue-50 text-[#2A77D5] border-blue-200"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Pan Tool"
                type="button"
              >
                <Hand className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleToolSelect("circle")}
                disabled={isDrawingMode || !!currentGeofence}
                className={`p-3 border-r border-gray-300 transition-colors duration-200 ${
                  selectedTool === "circle"
                    ? "bg-blue-50 text-[#2A77D5] border-blue-200"
                    : isDrawingMode || !!currentGeofence
                      ? "text-gray-400 cursor-not-allowed bg-gray-50"
                      : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Circle Tool"
                type="button"
              >
                <Circle className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleToolSelect("polygon")}
                disabled={isDrawingMode || !!currentGeofence}
                className={`p-3 border-r border-gray-300 transition-colors duration-200 ${
                  selectedTool === "polygon"
                    ? "bg-blue-50 text-[#2A77D5] border-blue-200"
                    : isDrawingMode || !!currentGeofence
                      ? "text-gray-400 cursor-not-allowed bg-gray-50"
                      : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Polygon Tool"
                type="button"
              >
                <Square className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleToolSelect("navigation")}
                className={`p-3 transition-colors duration-200 rounded-r-lg ${
                  selectedTool === "navigation"
                    ? "bg-blue-50 text-[#2A77D5] border-blue-200"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Navigation"
                type="button"
              >
                <Navigation className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 mx-5 bg-gray-100 z-10">
          <div ref={mapRef} className="w-full h-full" />

          {isDrawingMode && (
            <div className="absolute top-4 left-4 bg-[#2A77D5] text-white px-4 py-3 rounded-lg shadow-lg z-[1000]">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <p className="text-sm font-medium">
                  {selectedTool === "polygon"
                    ? "Click to add points • Double-click to finish"
                    : "Click center • Click edge to set radius"}
                </p>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
            <div className="text-xs text-gray-600">
              Tool: <span className="font-medium capitalize">{selectedTool}</span>
              {isDrawingMode && <span className="text-[#2A77D5] ml-2">• Drawing Active</span>}
              {currentGeofence && <span className="text-green-600 ml-2">• Geofence Ready</span>}
            </div>
          </div>
        </div>
        <div className="my-4 flex">
          {currentGeofence && (
            <div className="mx-auto my-auto">
              <Button onClick={handleAddGeofence} variant="contained">
                <Plus className="w-5 h-5" />
                <span>{getButtonText()}</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .company-marker,
        .geofence-number,
        .geofence-label {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default GeofenceModal;
