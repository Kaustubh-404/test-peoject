import {
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const cellStyle = {
  fontFamily: "Mukta",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "16px",
  color: "#3B3B3B",
  border: "none",
  padding: "16px",
};

/**
 * History Window Component
 * Shows guard history information with Overtime and Tenure tabs
 */

// Mock data - replace with API calls
const mockOvertimeData = [
  {
    id: 1,
    startDate: "01/03/2025",
    endDate: "02/03/2025",
    shift: "06:00 PM - 02:00 AM",
    client: "Epicuria",
    site: "Nehru Place",
    designation: "Security Guard",
  },
  {
    id: 2,
    startDate: "01/03/2020",
    endDate: "01/03/2021",
    shift: "08:00 AM - 06:00 PM",
    client: "Axis Bank",
    site: "Kalkaji F Block",
    designation: "Security Guard",
  },
];

const mockTenureData = [
  {
    id: 1,
    tenureStart: "01/03/2021",
    tenureEnd: "02/03/2023",
    shift: "06:00 PM - 02:00 AM",
    client: "Epicuria",
    site: "Nehru Place",
    designation: "Security Guard",
  },
  {
    id: 2,
    tenureStart: "01/03/2020",
    tenureEnd: "01/03/2021",
    shift: "08:00 AM - 06:00 PM",
    client: "Axis Bank",
    site: "Kalkaji F Block",
    designation: "Security Guard",
  },
];

type TabType = "OVERTIME" | "TENURE";

const HistoryWindow: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("OVERTIME");

  return (
    <Box
      sx={{
        width: "1052px",
        height: "840px",
        padding: "16px",
        borderRadius: "12px",
        background: "#F7F7F7",
      }}
    >
      <Box
        sx={{
          width: "1020px",
          height: "808px",
          gap: "12px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Content Heading */}
        <Box
          sx={{
            width: "1020px",
            height: "24px",
            gap: "8px",
          }}
        >
          <Box
            sx={{
              width: "1020px",
              height: "24px",
              gap: "16px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Mukta",
                fontWeight: 600,
                fontSize: "24px",
                lineHeight: "32px",
                textTransform: "capitalize",
                color: "#3B3B3B",
              }}
            >
              History
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Divider
          sx={{
            width: "1020px",
            border: "1px solid #FFFFFF",
          }}
        />

        {/* Tab Buttons */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: "494px",
              height: "42px",
              borderRadius: "11px",
              padding: "8px",
              gap: "8px",
              background: "#FFFFFF",
              display: "flex",
              mb: 2,
            }}
          >
            <Button
              onClick={() => setActiveTab("OVERTIME")}
              sx={{
                width: "235px",
                height: "26px",
                borderRadius: "8px",
                padding: "8px 24px",
                background: activeTab === "OVERTIME" ? "#2A77D5" : "#FFFFFF",
                color: activeTab === "OVERTIME" ? "#FFFFFF" : "#2A77D5",
                fontFamily: "Mukta",
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: "24px",
                textTransform: "uppercase",
                border: "none",
                boxShadow: "0px 1px 4px 0px #70707033",
                "&:hover": {
                  background: activeTab === "OVERTIME" ? "#2A77D5" : "#F5F5F5",
                  border: "none",
                  boxShadow: "0px 1px 4px 0px #70707033",
                },
                "&:focus": {
                  outline: "none",
                  border: "none",
                },
              }}
            >
              Overtime
            </Button>
            <Button
              onClick={() => setActiveTab("TENURE")}
              sx={{
                width: "235px",
                height: "26px",
                borderRadius: "8px",
                padding: "8px 24px",
                background: activeTab === "TENURE" ? "#2A77D5" : "#FFFFFF",
                color: activeTab === "TENURE" ? "#FFFFFF" : "#2A77D5",
                fontFamily: "Mukta",
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: "24px",
                textTransform: "uppercase",
                border: "none",
                boxShadow: "0px 1px 4px 0px #70707033",
                "&:hover": {
                  background: activeTab === "TENURE" ? "#2A77D5" : "#F5F5F5",
                  border: "none",
                  boxShadow: "0px 1px 4px 0px #70707033",
                },
                "&:focus": {
                  outline: "none",
                  border: "none",
                },
              }}
            >
              Tenure
            </Button>
          </Box>
        </Box>

        {/* Table Container */}
        <Box
          sx={{
            width: "1020px",
            background: "#FFFFFF",
            borderRadius: "8px",
            minHeight: "400px",
          }}
        >
          <TableContainer
            sx={{
              background: "#FFFFFF",
              borderRadius: "8px",
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background: "#F8F9FA",
                  }}
                >
                  {activeTab === "OVERTIME" ? (
                    <>
                      <TableCell
                        sx={{
                          fontFamily: "Mukta",
                          fontWeight: 600,
                          fontSize: "14px",
                          lineHeight: "16px",
                          color: "#707070",
                          textTransform: "uppercase",
                          border: "none",
                          padding: "16px",
                        }}
                      >
                        Start Date
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Mukta",
                          fontWeight: 600,
                          fontSize: "14px",
                          lineHeight: "16px",
                          color: "#707070",
                          textTransform: "uppercase",
                          border: "none",
                          padding: "16px",
                        }}
                      >
                        End Date
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Mukta",
                          fontWeight: 600,
                          fontSize: "14px",
                          lineHeight: "16px",
                          color: "#707070",
                          textTransform: "uppercase",
                          border: "none",
                          padding: "16px",
                        }}
                      >
                        Shift
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Mukta",
                          fontWeight: 600,
                          fontSize: "14px",
                          lineHeight: "16px",
                          color: "#707070",
                          textTransform: "uppercase",
                          border: "none",
                          padding: "16px",
                        }}
                      >
                        Client
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Mukta",
                          fontWeight: 600,
                          fontSize: "14px",
                          lineHeight: "16px",
                          color: "#707070",
                          textTransform: "uppercase",
                          border: "none",
                          padding: "16px",
                        }}
                      >
                        Site
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Mukta",
                          fontWeight: 600,
                          fontSize: "14px",
                          lineHeight: "16px",
                          color: "#707070",
                          textTransform: "uppercase",
                          border: "none",
                          padding: "16px",
                        }}
                      >
                        Designation
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell
                        sx={{
                          fontFamily: "Mukta",
                          fontWeight: 600,
                          fontSize: "14px",
                          lineHeight: "16px",
                          color: "#707070",
                          textTransform: "uppercase",
                          border: "none",
                          padding: "16px",
                        }}
                      >
                        Tenure Start
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Mukta",
                          fontWeight: 600,
                          fontSize: "14px",
                          lineHeight: "16px",
                          color: "#707070",
                          textTransform: "uppercase",
                          border: "none",
                          padding: "16px",
                        }}
                      >
                        Tenure End
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Mukta",
                          fontWeight: 600,
                          fontSize: "14px",
                          lineHeight: "16px",
                          color: "#707070",
                          textTransform: "uppercase",
                          border: "none",
                          padding: "16px",
                        }}
                      >
                        Shift
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Mukta",
                          fontWeight: 600,
                          fontSize: "14px",
                          lineHeight: "16px",
                          color: "#707070",
                          textTransform: "uppercase",
                          border: "none",
                          padding: "16px",
                        }}
                      >
                        Client
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Mukta",
                          fontWeight: 600,
                          fontSize: "14px",
                          lineHeight: "16px",
                          color: "#707070",
                          textTransform: "uppercase",
                          border: "none",
                          padding: "16px",
                        }}
                      >
                        Site
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Mukta",
                          fontWeight: 600,
                          fontSize: "14px",
                          lineHeight: "16px",
                          color: "#707070",
                          textTransform: "uppercase",
                          border: "none",
                          padding: "16px",
                        }}
                      >
                        Designation
                      </TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {activeTab === "OVERTIME"
                  ? mockOvertimeData.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#F8F9FA",
                          },
                        }}
                      >
                        <TableCell sx={cellStyle}>{row.startDate}</TableCell>
                        <TableCell sx={cellStyle}>{row.endDate}</TableCell>
                        <TableCell sx={cellStyle}>{row.shift}</TableCell>
                        <TableCell sx={cellStyle}>{row.client}</TableCell>
                        <TableCell sx={cellStyle}>{row.site}</TableCell>
                        <TableCell sx={cellStyle}>{row.designation}</TableCell>
                      </TableRow>
                    ))
                  : mockTenureData.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#F8F9FA",
                          },
                        }}
                      >
                        <TableCell sx={cellStyle}>{row.tenureStart}</TableCell>
                        <TableCell sx={cellStyle}>{row.tenureEnd}</TableCell>
                        <TableCell sx={cellStyle}>{row.shift}</TableCell>
                        <TableCell sx={cellStyle}>{row.client}</TableCell>
                        <TableCell sx={cellStyle}>{row.site}</TableCell>
                        <TableCell sx={cellStyle}>{row.designation}</TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default HistoryWindow;
