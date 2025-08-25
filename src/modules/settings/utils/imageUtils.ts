// File: src/modules/settings/utils/imageUtils.ts

export interface Point {
  x: number;
  y: number;
}

export interface TaggedElement {
  id: string;
  name: string;
  imageIndex: number;
  shape: "rectangle" | "circle" | "polyline";
  coordinates: {
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    points?: Point[];
  };
  croppedImage: string;
}

/**
 * Convert a data URL to a File object
 */
export const dataURLToFile = (dataURL: string, filename: string): File => {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

/**
 * Crop image from canvas based on coordinates and shape
 */
export const cropImageFromCanvas = (
  originalImage: File,
  coordinates: any,
  shape: string,
  canvasWidth: number = 288,
  canvasHeight: number = 400
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    const img = new Image();
    img.onload = () => {
      try {
        if (shape === "rectangle" && coordinates.width && coordinates.height) {
          canvas.width = coordinates.width;
          canvas.height = coordinates.height;

          const scaleX = img.naturalWidth / canvasWidth;
          const scaleY = img.naturalHeight / canvasHeight;

          ctx.drawImage(
            img,
            coordinates.x * scaleX,
            coordinates.y * scaleY,
            coordinates.width * scaleX,
            coordinates.height * scaleY,
            0,
            0,
            coordinates.width,
            coordinates.height
          );
        } else if (shape === "circle" && coordinates.radius) {
          const diameter = coordinates.radius * 2;
          canvas.width = diameter;
          canvas.height = diameter;

          ctx.beginPath();
          ctx.arc(coordinates.radius, coordinates.radius, coordinates.radius, 0, Math.PI * 2);
          ctx.clip();

          const scaleX = img.naturalWidth / canvasWidth;
          const scaleY = img.naturalHeight / canvasHeight;

          ctx.drawImage(
            img,
            (coordinates.x - coordinates.radius) * scaleX,
            (coordinates.y - coordinates.radius) * scaleY,
            diameter * scaleX,
            diameter * scaleY,
            0,
            0,
            diameter,
            diameter
          );
        } else if (shape === "polyline" && coordinates.points) {
          const xs = coordinates.points.map((p: Point) => p.x);
          const ys = coordinates.points.map((p: Point) => p.y);
          const minX = Math.min(...xs);
          const maxX = Math.max(...xs);
          const minY = Math.min(...ys);
          const maxY = Math.max(...ys);

          canvas.width = maxX - minX;
          canvas.height = maxY - minY;

          ctx.beginPath();
          coordinates.points.forEach((point: Point, index: number) => {
            const x = point.x - minX;
            const y = point.y - minY;
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.closePath();
          ctx.clip();

          const scaleX = img.naturalWidth / canvasWidth;
          const scaleY = img.naturalHeight / canvasHeight;

          ctx.drawImage(
            img,
            minX * scaleX,
            minY * scaleY,
            (maxX - minX) * scaleX,
            (maxY - minY) * scaleY,
            0,
            0,
            maxX - minX,
            maxY - minY
          );
        }

        resolve(canvas.toDataURL());
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = URL.createObjectURL(originalImage);
  });
};

/**
 * Enhanced categorization logic for tagged elements
 */
export const categorizeTaggedElement = (elementName: string): "top" | "bottom" | "accessory" => {
  const elementNameLower = elementName.toLowerCase().trim();

  // Top part keywords (shirts, jackets, upper body items)
  const topKeywords = [
    "top",
    "shirt",
    "blouse",
    "jacket",
    "blazer",
    "vest",
    "uniform",
    "chest",
    "collar",
    "sleeve",
    "pocket",
    "logo",
    "emblem",
    "patch",
    "button",
    "shoulder",
    "upper",
    "tunic",
    "jumper",
  ];

  // Bottom part keywords (pants, skirts, lower body items)
  const bottomKeywords = [
    "bottom",
    "pant",
    "pants",
    "trouser",
    "trousers",
    "skirt",
    "short",
    "shorts",
    "lower",
    "leg",
    "knee",
    "waist",
    "belt loop",
    "hem",
  ];

  // Accessory keywords (everything else)
  const accessoryKeywords = [
    "accessory",
    "accessories",
    "badge",
    "belt",
    "cap",
    "hat",
    "helmet",
    "tie",
    "bow",
    "scarf",
    "glove",
    "gloves",
    "watch",
    "band",
    "strap",
    "buckle",
    "pin",
    "button",
    "zipper",
    "velcro",
    "name tag",
    "id",
    "insignia",
    "rank",
    "medal",
    "award",
    "lanyard",
    "clip",
    "holder",
  ];

  // Check for top keywords
  for (const keyword of topKeywords) {
    if (elementNameLower.includes(keyword)) {
      console.log(`📝 Categorized "${elementName}" as TOP (matched: ${keyword})`);
      return "top";
    }
  }

  // Check for bottom keywords
  for (const keyword of bottomKeywords) {
    if (elementNameLower.includes(keyword)) {
      console.log(`📝 Categorized "${elementName}" as BOTTOM (matched: ${keyword})`);
      return "bottom";
    }
  }

  // Check for accessory keywords or default to accessory
  for (const keyword of accessoryKeywords) {
    if (elementNameLower.includes(keyword)) {
      console.log(`📝 Categorized "${elementName}" as ACCESSORY (matched: ${keyword})`);
      return "accessory";
    }
  }

  // Default case - if no matches, categorize as accessory
  console.log(`📝 Categorized "${elementName}" as ACCESSORY (default)`);
  return "accessory";
};

/**
 * Process tagged elements and convert them to files organized by category
 */
export const processTaggedElements = async (
  taggedElements: TaggedElement[],
  uploadedImages: File[],
  uniformName: string
): Promise<{
  topPartFiles: File[];
  bottomPartFiles: File[];
  accessoryFiles: File[];
}> => {
  const topPartFiles: File[] = [];
  const bottomPartFiles: File[] = [];
  const accessoryFiles: File[] = [];

  console.log(`📝 Processing ${taggedElements.length} tagged elements...`);

  // Process each tagged element
  for (const element of taggedElements) {
    try {
      const originalImage = uploadedImages[element.imageIndex];
      if (!originalImage) {
        console.warn(`⚠️ Original image not found for element ${element.id} at index ${element.imageIndex}`);
        continue;
      }

      // Crop the image based on the tagged coordinates
      const croppedDataURL = await cropImageFromCanvas(originalImage, element.coordinates, element.shape);

      // Create meaningful filename with timestamp to avoid conflicts
      const timestamp = Date.now();
      const sanitizedName = element.name.replace(/[^a-zA-Z0-9]/g, "_");
      const sanitizedUniformName = uniformName.replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `${sanitizedUniformName}_${sanitizedName}_${timestamp}.png`;

      const file = dataURLToFile(croppedDataURL, filename);

      // Categorize the element intelligently
      const category = categorizeTaggedElement(element.name);

      // Add to appropriate category
      switch (category) {
        case "top":
          topPartFiles.push(file);
          break;
        case "bottom":
          bottomPartFiles.push(file);
          break;
        case "accessory":
        default:
          accessoryFiles.push(file);
          break;
      }

      console.log(`✅ Processed element: "${element.name}" -> ${category.toUpperCase()} (${filename})`);
    } catch (error) {
      console.error(`❌ Error processing element ${element.id} ("${element.name}"):`, error);
    }
  }

  console.log(`📊 Processing complete:
    - Top parts: ${topPartFiles.length} files
    - Bottom parts: ${bottomPartFiles.length} files  
    - Accessories: ${accessoryFiles.length} files
    - Total: ${topPartFiles.length + bottomPartFiles.length + accessoryFiles.length} files`);

  return {
    topPartFiles,
    bottomPartFiles,
    accessoryFiles,
  };
};

/**
 * Validate image files
 */
export const validateImageFiles = (files: File[]): string[] => {
  const errors: string[] = [];
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

  files.forEach((file, index) => {
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File ${index + 1} (${file.name}): Invalid file type. Please use JPEG, PNG, or GIF.`);
    }

    if (file.size > maxFileSize) {
      errors.push(`File ${index + 1} (${file.name}): File size exceeds 5MB limit.`);
    }
  });

  return errors;
};
