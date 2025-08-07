// import CheckIcon from "@mui/icons-material/Check";
// import CloseIcon from "@mui/icons-material/Close";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import StarIcon from "@mui/icons-material/Star";
// import {
//   Alert,
//   Box,
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogContent,
//   Divider,
//   FormControl,
//   IconButton,
//   MenuItem,
//   Select,
//   Snackbar,
//   TextField,
//   Typography,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { formatDateOnly } from "../../../../../utils/dateFormatter";
// import { useOfficers } from "../../../context/OfficerContext";
// import {
//   useOfficerProfile,
//   useUpdateOfficerContactDetails,
//   useUpdateOfficerEmergencyContact,
//   useUpdateOfficerEmploymentDetails,
//   useUpdateOfficerPersonalDetails,
// } from "../../../hooks/useOfficerProfile";
// import type { APIOfficerProfile } from "../../../service/officers-api.service";

// // Officer Profile Window Component with API integration
// const OfficerProfileWindow: React.FC = () => {
//   const { officerName } = useParams<{ officerName: string }>();
//   const { getOfficerByName } = useOfficers();

//   // 🔥 UPDATED: State for officer identification - using guard ID
//   const [guardId, setGuardId] = useState<string | null>(null);
//   const [agencyId, setAgencyId] = useState<string | null>(null);

//   // 🔥 UPDATED: API hooks - they now use guard ID directly
//   const {
//     data: officerProfileData,
//     isLoading: profileLoading,
//     error: profileError,
//     refetch: refetchProfile,
//   } = useOfficerProfile(guardId, agencyId);

//   // Update hooks for different sections
//   const personalDetailsUpdate = useUpdateOfficerPersonalDetails();
//   const contactDetailsUpdate = useUpdateOfficerContactDetails();
//   const emergencyContactUpdate = useUpdateOfficerEmergencyContact();
//   const employmentDetailsUpdate = useUpdateOfficerEmploymentDetails();

//   // Local state for UI
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [editingSection, setEditingSection] = useState<string>("");
//   const [editFormData, setEditFormData] = useState<any>({});
//   const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   // 🔥 UPDATED: Initialize guard ID and agency ID
//   useEffect(() => {
//     if (officerName) {
//       const officer = getOfficerByName(officerName);
//       if (officer) {
//         // ✅ Use the guard ID directly from the officer object
//         setGuardId(officer.guardId);
//         setAgencyId(officer.currentAgencyId);

//         console.log("🔍 Officer found for profile:", {
//           name: officerName,
//           referenceId: officer.id,
//           guardId: officer.guardId, // This is what we'll use for API calls
//           agencyId: officer.currentAgencyId,
//         });
//       } else {
//         console.warn(`Officer not found for name: ${officerName}`);
//       }
//     }
//   }, [officerName, getOfficerByName]);

//   // Show snackbar for update results
//   useEffect(() => {
//     if (
//       personalDetailsUpdate.isSuccess ||
//       contactDetailsUpdate.isSuccess ||
//       emergencyContactUpdate.isSuccess ||
//       employmentDetailsUpdate.isSuccess
//     ) {
//       setSnackbar({
//         open: true,
//         message: "Officer profile updated successfully!",
//         severity: "success",
//       });
//       setEditDialogOpen(false);
//     }
//   }, [
//     personalDetailsUpdate.isSuccess,
//     contactDetailsUpdate.isSuccess,
//     emergencyContactUpdate.isSuccess,
//     employmentDetailsUpdate.isSuccess,
//   ]);

//   // Show error snackbar
//   useEffect(() => {
//     const error =
//       personalDetailsUpdate.error ||
//       contactDetailsUpdate.error ||
//       emergencyContactUpdate.error ||
//       employmentDetailsUpdate.error;

//     if (error) {
//       setSnackbar({
//         open: true,
//         message: error.message || "Failed to update officer profile",
//         severity: "error",
//       });
//     }
//   }, [
//     personalDetailsUpdate.error,
//     contactDetailsUpdate.error,
//     emergencyContactUpdate.error,
//     employmentDetailsUpdate.error,
//   ]);

//   // Function to render stars based on trust score
//   const renderStars = (score: number) => {
//     const stars = [];
//     const fullStars = Math.floor(score);
//     const hasHalfStar = score - fullStars >= 0.5;

//     let starColor = "#41AA4D";
//     if (score < 3) {
//       starColor = "#E05952";
//     } else if (score < 4) {
//       starColor = "#E4C710";
//     }

//     for (let i = 0; i < 5; i++) {
//       const isFilled = i < fullStars || (i === fullStars && hasHalfStar);
//       stars.push(
//         <StarIcon
//           key={i}
//           sx={{
//             color: isFilled ? starColor : "#D9D9D9",
//             width: 16,
//             height: 16,
//           }}
//         />
//       );
//     }

//     return stars;
//   };

//   // Transform API data to display format
//   // Replace the transformApiDataToDisplayFormat function in OfficerProfileWindow.tsx

//   // Transform API data to display format
//   const transformApiDataToDisplayFormat = (apiData: APIOfficerProfile) => {
//     // Get addresses with proper null checks
//     const permanentAddress = apiData.addresses?.find((addr) => addr.type === "PERMANENT");
//     const localAddress =
//       apiData.addresses?.find((addr) => addr.type === "CURRENT") ||
//       apiData.addresses?.find((addr) => addr.type === "TEMPORARY") ||
//       permanentAddress;

//     // Get contacts with proper null checks
//     const primaryContact = apiData.contacts?.find((contact) => contact.contactType === "PRIMARY");
//     const alternateContact = apiData.contacts?.find((contact) => contact.contactType === "ALTERNATE");

//     // 🔥 FIX: Get family members with proper null checks and array validation
//     const familyMembers = Array.isArray(apiData.familyMembers) ? apiData.familyMembers : [];
//     const father = familyMembers.find((member) => member.relationshipType === "FATHER");
//     const mother = familyMembers.find((member) => member.relationshipType === "MOTHER");
//     const spouse = familyMembers.find((member) => member.relationshipType === "SPOUSE");

//     // Get employment details with proper null checks
//     const employments = Array.isArray(apiData.employments) ? apiData.employments : [];
//     const currentEmployment = employments.find((emp) => emp.isCurrentEmployer);

//     // Get documents with proper null checks
//     const documents = Array.isArray(apiData.documents) ? apiData.documents : [];

//     // Get emergency contacts with proper null checks
//     const emergencyContacts = Array.isArray(apiData.emergencyContacts) ? apiData.emergencyContacts : [];

//     return {
//       personalDetails: {
//         firstName: apiData.firstName || "",
//         middleName: apiData.middleName || "",
//         lastName: apiData.lastName || "",
//         email: apiData.email || "",
//         dateOfBirth: apiData.dateOfBirth || "",
//         age: apiData.dateOfBirth
//           ? Math.floor((Date.now() - new Date(apiData.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
//           : 0,
//         sex: apiData.sex || "",
//         bloodGroup: apiData.bloodGroup || "",
//         nationality: apiData.nationality || "",
//         height: apiData.height?.toString() || "",
//         weight: apiData.weight?.toString() || "",
//         identificationMark: apiData.identificationMark || "",
//         fatherName: father?.name || "",
//         motherName: mother?.name || "",
//         maritalStatus:
//           apiData.martialStatus === "MARRIED"
//             ? "Married"
//             : apiData.martialStatus === "SINGLE"
//               ? "Single"
//               : apiData.martialStatus === "DIVORCED"
//                 ? "Divorced"
//                 : apiData.martialStatus === "WIDOWED"
//                   ? "Widowed"
//                   : "Other",
//         spouseName: spouse?.name || "",
//         profilePhoto: apiData.photo || "",
//       },
//       contactDetails: {
//         phoneNumber: primaryContact?.phoneNumber || apiData.phoneNumber || "",
//         alternateNumber: alternateContact?.phoneNumber || "",
//         emergencyContact: {
//           firstName: emergencyContacts[0]?.contactName?.split(" ")[0] || "",
//           lastName: emergencyContacts[0]?.contactName?.split(" ").slice(1).join(" ") || "",
//           relationship: emergencyContacts[0]?.relationship || "",
//           contactNumber: emergencyContacts[0]?.phoneNumber || "",
//         },
//       },
//       address: {
//         localAddress: {
//           addressLine1: localAddress?.line1 || "",
//           addressLine2: localAddress?.line2 || "",
//           city: localAddress?.city || "",
//           district: localAddress?.district || "",
//           pincode: localAddress?.pinCode || "",
//           state: localAddress?.state || "",
//           landmark: localAddress?.landmark || "",
//         },
//         permanentAddress: {
//           addressLine1: permanentAddress?.line1 || "",
//           addressLine2: permanentAddress?.line2 || "",
//           city: permanentAddress?.city || "",
//           district: permanentAddress?.district || "",
//           pincode: permanentAddress?.pinCode || "",
//           state: permanentAddress?.state || "",
//           landmark: permanentAddress?.landmark || "",
//         },
//       },
//       employmentDetails: {
//         companyId: apiData.currentAgencyId || "",
//         dateOfJoining: currentEmployment?.startDate || "",
//         designation: currentEmployment?.position || "Area Officer",
//         assignedArea: "Area Assignment", // This would come from another API field
//         areaManager: "Area Manager", // This would come from another API field
//       },
//       documentVerification: {
//         documents: {
//           aadhaarCard: documents.some((doc) => doc.type === "AADHAR_CARD" || doc.type === "ID_CARD") || false,
//           birthCertificate: documents.some((doc) => doc.type === "BIRTH_CERTIFICATE") || false,
//           educationCertificate: documents.some((doc) => doc.type === "EDUCATION_CERTIFICATE") || false,
//           panCard: documents.some((doc) => doc.type === "PAN_CARD") || false,
//         },
//       },
//       upAndUpTrust: Math.random() * 2 + 3, // This would come from another API/calculation
//     };
//   };
//   // Handle edit button click
//   const handleEdit = (section: string) => {
//     if (!officerProfileData) return;

//     const displayData = transformApiDataToDisplayFormat(officerProfileData);
//     setEditingSection(section);

//     switch (section) {
//       case "personal":
//         setEditFormData({
//           firstName: displayData.personalDetails.firstName,
//           middleName: displayData.personalDetails.middleName,
//           lastName: displayData.personalDetails.lastName,
//           email: displayData.personalDetails.email,
//           dateOfBirth: displayData.personalDetails.dateOfBirth,
//           age: displayData.personalDetails.age,
//           sex: displayData.personalDetails.sex,
//           bloodGroup: displayData.personalDetails.bloodGroup,
//           nationality: displayData.personalDetails.nationality,
//           height: displayData.personalDetails.height,
//           weight: displayData.personalDetails.weight,
//           identificationMark: displayData.personalDetails.identificationMark,
//           fatherName: displayData.personalDetails.fatherName,
//           motherName: displayData.personalDetails.motherName,
//           spouseName: displayData.personalDetails.spouseName,
//           maritalStatus: displayData.personalDetails.maritalStatus,
//         });
//         break;
//       case "contact":
//         setEditFormData({
//           phoneNumber: displayData.contactDetails.phoneNumber,
//           alternateNumber: displayData.contactDetails.alternateNumber,
//           localAddress: displayData.address.localAddress,
//           permanentAddress: displayData.address.permanentAddress,
//         });
//         break;
//       case "emergency":
//         setEditFormData({
//           contactName:
//             `${displayData.contactDetails.emergencyContact.firstName} ${displayData.contactDetails.emergencyContact.lastName}`.trim(),
//           relationship: displayData.contactDetails.emergencyContact.relationship,
//           contactNumber: displayData.contactDetails.emergencyContact.contactNumber,
//         });
//         break;
//       case "employment":
//         setEditFormData({
//           companyId: displayData.employmentDetails.companyId,
//           dateOfJoining: displayData.employmentDetails.dateOfJoining,
//           designation: displayData.employmentDetails.designation,
//           assignedArea: displayData.employmentDetails.assignedArea,
//           areaManager: displayData.employmentDetails.areaManager,
//         });
//         break;
//       default:
//         setEditFormData({});
//     }
//     setEditDialogOpen(true);
//   };

//   // 🔥 UPDATED: Handle save changes using guard ID
//   // Replace the existing handleSaveChanges function in OfficerProfileWindow.tsx

//   // Handle save changes using guard ID
//   const handleSaveChanges = async () => {
//     if (!guardId || !agencyId) {
//       setSnackbar({
//         open: true,
//         message: "Missing guard or agency information",
//         severity: "error",
//       });
//       return;
//     }

//     try {
//       switch (editingSection) {
//         case "personal":
//           await personalDetailsUpdate.updatePersonalDetails(guardId, agencyId, {
//             firstName: editFormData.firstName,
//             middleName: editFormData.middleName,
//             lastName: editFormData.lastName,
//             dateOfBirth: editFormData.dateOfBirth,
//             sex: editFormData.sex,
//             bloodGroup: editFormData.bloodGroup,
//             nationality: editFormData.nationality,
//             height: editFormData.height ? parseInt(editFormData.height) : undefined,
//             weight: editFormData.weight ? parseInt(editFormData.weight) : undefined,
//             identificationMark: editFormData.identificationMark,
//             martialStatus:
//               editFormData.maritalStatus === "Married"
//                 ? "MARRIED"
//                 : editFormData.maritalStatus === "Single"
//                   ? "SINGLE"
//                   : editFormData.maritalStatus === "Divorced"
//                     ? "DIVORCED"
//                     : editFormData.maritalStatus === "Widowed"
//                       ? "WIDOWED"
//                       : "SINGLE",
//             // 🔥 ADD THIS: Family members
//             familyMembers: {
//               fatherName: editFormData.fatherName,
//               motherName: editFormData.motherName,
//               spouseName: editFormData.spouseName,
//             },
//           });
//           break;

//         case "contact":
//           await contactDetailsUpdate.updateContactDetails(guardId, agencyId, {
//             phoneNumber: editFormData.phoneNumber,
//             alternateNumber: editFormData.alternateNumber,
//             addresses: {
//               permanent: editFormData.permanentAddress,
//               local: editFormData.localAddress,
//             },
//           });
//           break;

//         case "emergency":
//           await emergencyContactUpdate.updateEmergencyContact(guardId, agencyId, {
//             contactName: editFormData.contactName,
//             relationship: editFormData.relationship,
//             phoneNumber: editFormData.contactNumber,
//           });
//           break;

//         case "employment":
//           await employmentDetailsUpdate.updateEmploymentDetails(guardId, agencyId, {
//             position: editFormData.designation,
//             startDate: editFormData.dateOfJoining,
//             assignedArea: editFormData.assignedArea,
//             designation: editFormData.designation,
//             areaManager: editFormData.areaManager,
//           });
//           break;

//         default:
//           throw new Error("Unknown section for update");
//       }
//     } catch (error: any) {
//       console.error("Error saving officer changes:", error);
//       setSnackbar({
//         open: true,
//         message: error.message || "Failed to save changes",
//         severity: "error",
//       });
//     }
//   };

//   // Handle delete officer profile
//   const handleDeleteProfile = () => {
//     if (window.confirm("Are you sure you want to delete this officer profile?")) {
//       console.log("Deleting officer profile");
//       // TODO: Implement delete API call
//       setSnackbar({
//         open: true,
//         message: "Delete functionality not yet implemented",
//         severity: "error",
//       });
//     }
//   };

//   // 🔥 UPDATED: Early return if guard ID is not available
//   if (!guardId || !agencyId) {
//     return (
//       <Box
//         sx={{
//           width: "100%",
//           height: "100vh",
//           padding: "24px",
//           borderRadius: "12px",
//           background: "#F7F7F7",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Typography
//           sx={{
//             fontFamily: "Mukta",
//             fontSize: "20px",
//             fontWeight: 500,
//             color: "#707070",
//           }}
//         >
//           Initializing officer profile...
//         </Typography>
//       </Box>
//     );
//   }

//   // Loading state
//   if (profileLoading) {
//     return (
//       <Box
//         sx={{
//           width: "100%",
//           height: "100vh",
//           padding: "24px",
//           borderRadius: "12px",
//           background: "#F7F7F7",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           flexDirection: "column",
//           gap: 2,
//         }}
//       >
//         <CircularProgress color="primary" size={48} />
//         <Typography
//           sx={{
//             fontFamily: "Mukta",
//             fontSize: "20px",
//             fontWeight: 500,
//             color: "#707070",
//           }}
//         >
//           Loading officer profile...
//         </Typography>
//         <Typography
//           sx={{
//             fontFamily: "Mukta",
//             fontSize: "14px",
//             color: "#A0A0A0",
//           }}
//         >
//           Fetching details using guard ID: {guardId}
//         </Typography>
//       </Box>
//     );
//   }

//   // Error state
//   if (profileError) {
//     return (
//       <Box
//         sx={{
//           width: "100%",
//           height: "100vh",
//           padding: "24px",
//           borderRadius: "12px",
//           background: "#F7F7F7",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           flexDirection: "column",
//           gap: 2,
//         }}
//       >
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {profileError.message}
//         </Alert>
//         <Button
//           variant="contained"
//           onClick={() => refetchProfile()}
//           sx={{
//             backgroundColor: "#2A77D5",
//             "&:hover": { backgroundColor: "#1E5AA3" },
//           }}
//         >
//           Retry
//         </Button>
//       </Box>
//     );
//   }

//   // No data state
//   if (!officerProfileData) {
//     return (
//       <Box
//         sx={{
//           width: "100%",
//           height: "100vh",
//           padding: "24px",
//           borderRadius: "12px",
//           background: "#F7F7F7",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Typography
//           sx={{
//             fontFamily: "Mukta",
//             fontSize: "20px",
//             fontWeight: 500,
//             color: "#707070",
//           }}
//         >
//           No officer profile data available
//         </Typography>
//       </Box>
//     );
//   }

//   // 🔥 ADD THIS CONSOLE.LOG HERE - after data is confirmed to exist
//   console.log("✅ Officer profile loaded successfully:", {
//     guardId: guardId,
//     profileId: officerProfileData.id,
//     name: `${officerProfileData.firstName} ${officerProfileData.lastName}`,
//   });

//   // Transform API data for display
//   const displayData = transformApiDataToDisplayFormat(officerProfileData);

//   // Create formatted address strings
//   const localAddressString = `${displayData.address.localAddress.addressLine1}${displayData.address.localAddress.addressLine2 ? ", " + displayData.address.localAddress.addressLine2 : ""}\n${displayData.address.localAddress.city}, ${displayData.address.localAddress.district}\n${displayData.address.localAddress.state} - ${displayData.address.localAddress.pincode}`;

//   const permanentAddressString = `${displayData.address.permanentAddress.addressLine1}${displayData.address.permanentAddress.addressLine2 ? ", " + displayData.address.permanentAddress.addressLine2 : ""}\n${displayData.address.permanentAddress.city}, ${displayData.address.permanentAddress.district}\n${displayData.address.permanentAddress.state} - ${displayData.address.permanentAddress.pincode}`;

//   // Key-Value pair component for displaying data
//   const KeyValuePair: React.FC<{ label: string; value: string }> = ({ label, value }) => (
//     <Box sx={{ display: "flex", gap: "12px", mb: "8px", alignItems: "flex-start" }}>
//       <Typography
//         sx={{
//           width: "88px",
//           fontFamily: "Mukta",
//           fontWeight: 400,
//           fontSize: "14px",
//           lineHeight: "16px",
//           color: "#A3A3A3",
//           flexShrink: 0,
//         }}
//       >
//         {label}
//       </Typography>
//       <Typography
//         sx={{
//           flex: 1,
//           fontFamily: "Mukta",
//           fontWeight: 400,
//           fontSize: "14px",
//           lineHeight: "16px",
//           color: "#3B3B3B",
//           wordBreak: "break-word",
//         }}
//       >
//         {value || "N/A"}
//       </Typography>
//     </Box>
//   );

//   // Address Key-Value pair component for multi-line addresses
//   const AddressKeyValuePair: React.FC<{ label: string; value: string }> = ({ label, value }) => (
//     <Box sx={{ display: "flex", gap: "12px", mb: "12px", alignItems: "flex-start" }}>
//       <Typography
//         sx={{
//           width: "88px",
//           fontFamily: "Mukta",
//           fontWeight: 400,
//           fontSize: "14px",
//           lineHeight: "16px",
//           color: "#A3A3A3",
//           flexShrink: 0,
//         }}
//       >
//         {label}
//       </Typography>
//       <Typography
//         sx={{
//           flex: 1,
//           fontFamily: "Mukta",
//           fontWeight: 400,
//           fontSize: "14px",
//           lineHeight: "16px",
//           color: "#3B3B3B",
//           whiteSpace: "pre-line",
//           wordBreak: "break-word",
//         }}
//       >
//         {value || "N/A"}
//       </Typography>
//     </Box>
//   );

//   // Document Card Component
//   const DocumentCard: React.FC<{
//     title: string;
//     documentNumber: string;
//     verified: boolean;
//     image?: string | null;
//   }> = ({ title, documentNumber, verified, image }) => {
//     // Get color based on document type
//     const getDocumentColor = (docTitle: string) => {
//       switch (docTitle.toUpperCase()) {
//         case "AADHAAR CARD":
//           return "#4CAF50";
//         case "BIRTH CERTIFICATE":
//           return "#2196F3";
//         case "EDUCATION CERTIFICATE":
//           return "#FF9800";
//         case "PAN CARD":
//           return "#9C27B0";
//         default:
//           return "#757575";
//       }
//     };

//     const getDocumentInitials = (docTitle: string) => {
//       switch (docTitle.toUpperCase()) {
//         case "AADHAAR CARD":
//           return "AD";
//         case "BIRTH CERTIFICATE":
//           return "BC";
//         case "EDUCATION CERTIFICATE":
//           return "EC";
//         case "PAN CARD":
//           return "PC";
//         default:
//           return "DOC";
//       }
//     };

//     return (
//       <Box
//         sx={{
//           width: "100%",
//           height: "80px",
//           borderRadius: "12px",
//           padding: "8px",
//           border: "2px solid #F7F7F7",
//           backgroundColor: "#FFFFFF",
//           mb: "8px",
//         }}
//       >
//         <Box
//           sx={{
//             width: "100%",
//             height: "64px",
//             borderRadius: "8px",
//             backgroundColor: "#FEFCF1",
//             padding: "8px",
//             display: "flex",
//             gap: "12px",
//             alignItems: "center",
//           }}
//         >
//           {/* Document Photo */}
//           <Box
//             sx={{
//               width: "48px",
//               height: "48px",
//               borderRadius: "4px",
//               backgroundColor: image ? "#F0F0F0" : getDocumentColor(title),
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               overflow: "hidden",
//               flexShrink: 0,
//             }}
//           >
//             {image ? (
//               <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//             ) : (
//               <Typography
//                 sx={{
//                   fontSize: "12px",
//                   fontWeight: "bold",
//                   color: "#ffffff",
//                   fontFamily: "Mukta",
//                 }}
//               >
//                 {getDocumentInitials(title)}
//               </Typography>
//             )}
//           </Box>

//           {/* Document Details */}
//           <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden" }}>
//             <Typography
//               sx={{
//                 fontFamily: "Mukta",
//                 fontWeight: 600,
//                 fontSize: "14px",
//                 lineHeight: "16px",
//                 color: "#575757",
//                 textTransform: "uppercase",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               {title}
//             </Typography>
//             <Typography
//               sx={{
//                 fontFamily: "Mukta",
//                 fontWeight: 400,
//                 fontSize: "14px",
//                 lineHeight: "16px",
//                 color: "#575757",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               {documentNumber}
//             </Typography>
//           </Box>

//           {/* Verification Icon */}
//           {verified && (
//             <CheckIcon
//               sx={{
//                 width: "20px",
//                 height: "20px",
//                 color: "#4CAF50",
//                 flexShrink: 0,
//               }}
//             />
//           )}
//         </Box>
//       </Box>
//     );
//   };

//   const isUpdating =
//     personalDetailsUpdate.isLoading ||
//     contactDetailsUpdate.isLoading ||
//     emergencyContactUpdate.isLoading ||
//     employmentDetailsUpdate.isLoading;

//   return (
//     <Box
//       sx={{
//         width: "1052px",
//         minHeight: "840px",
//         padding: "24px",
//         borderRadius: "12px",
//         background: "#F7F7F7",
//       }}
//     >
//       {/* Main Content Container */}
//       <Box
//         sx={{
//           width: "1020px",
//           height: "808px",
//           margin: "0 auto",
//           gap: "24px",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {/* Content Heading */}
//         <Box sx={{ width: "1020px", height: "32px", gap: "8px" }}>
//           <Typography
//             sx={{
//               fontFamily: "Mukta",
//               fontWeight: 600,
//               fontSize: "24px",
//               lineHeight: "32px",
//               textTransform: "capitalize",
//               color: "#3B3B3B",
//               mb: "8px",
//             }}
//           >
//             Officer Profile
//           </Typography>
//           <Divider sx={{ borderColor: "#FFFFFF", width: "1020px" }} />
//         </Box>

//         {/* Content */}
//         <Box
//           sx={{
//             width: "1020px",
//             height: "752px",
//             display: "flex",
//             gap: "12px",
//           }}
//         >
//           {/* Left Frame - Cards */}
//           <Box
//             sx={{
//               flex: "1 1 700px",
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
//               gap: "16px",
//               alignContent: "start",
//             }}
//           >
//             {/* Card 1 - Personal */}
//             <Box
//               sx={{
//                 borderRadius: "10px",
//                 padding: "16px",
//                 backgroundColor: "#FFFFFF",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "12px",
//                 minHeight: "300px",
//               }}
//             >
//               {/* Header */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontFamily: "Mukta",
//                     fontWeight: 600,
//                     fontSize: "16px",
//                     lineHeight: "20px",
//                     color: "#3B3B3B",
//                     textTransform: "capitalize",
//                   }}
//                 >
//                   Personal
//                 </Typography>
//                 <IconButton
//                   onClick={() => handleEdit("personal")}
//                   disabled={isUpdating}
//                   sx={{
//                     width: "24px",
//                     height: "24px",
//                     borderRadius: "50%",
//                     boxShadow: "0px 1px 4px rgba(112, 112, 112, 0.2)",
//                     backgroundColor: "#FFFFFF",
//                     "&:hover": {
//                       backgroundColor: "#F5F5F5",
//                     },
//                     "&.Mui-disabled": {
//                       backgroundColor: "#F0F0F0",
//                     },
//                   }}
//                 >
//                   {isUpdating ? (
//                     <CircularProgress size={14} />
//                   ) : (
//                     <EditIcon sx={{ width: "14px", height: "14px", color: "#2A77D5" }} />
//                   )}
//                 </IconButton>
//               </Box>

//               {/* Content */}
//               <Box sx={{ flex: 1 }}>
//                 {/* BASIC Section */}
//                 <Typography
//                   sx={{
//                     fontFamily: "Mukta",
//                     fontWeight: 600,
//                     fontSize: "12px",
//                     lineHeight: "16px",
//                     color: "#707070",
//                     textTransform: "uppercase",
//                     mb: "8px",
//                   }}
//                 >
//                   BASIC
//                 </Typography>

//                 <Box sx={{ mb: "16px" }}>
//                   <KeyValuePair
//                     label="Full Name"
//                     value={`${displayData.personalDetails.firstName} ${displayData.personalDetails.middleName || ""} ${displayData.personalDetails.lastName}`
//                       .replace(/\s+/g, " ")
//                       .trim()}
//                   />
//                   <KeyValuePair label="Email" value={displayData.personalDetails.email} />
//                   <KeyValuePair label="Date of Birth" value={formatDateOnly(displayData.personalDetails.dateOfBirth)} />
//                   <KeyValuePair label="Age" value={displayData.personalDetails.age?.toString() || ""} />
//                   <KeyValuePair label="Sex" value={displayData.personalDetails.sex} />
//                   <KeyValuePair label="Blood Group" value={displayData.personalDetails.bloodGroup} />
//                   <KeyValuePair label="Nationality" value={displayData.personalDetails.nationality} />
//                   <KeyValuePair label="Height" value={`${displayData.personalDetails.height} cm`} />
//                   <KeyValuePair label="Weight" value={`${displayData.personalDetails.weight} kg`} />
//                   <KeyValuePair label="ID Mark" value={displayData.personalDetails.identificationMark} />
//                 </Box>

//                 <Divider sx={{ borderColor: "#F0F0F0", mb: "16px" }} />

//                 {/* RELATIONS Section */}
//                 <Typography
//                   sx={{
//                     fontFamily: "Mukta",
//                     fontWeight: 600,
//                     fontSize: "12px",
//                     lineHeight: "16px",
//                     color: "#707070",
//                     textTransform: "uppercase",
//                     mb: "8px",
//                   }}
//                 >
//                   RELATIONS
//                 </Typography>

//                 <Box>
//                   <KeyValuePair label="Father's Name" value={displayData.personalDetails.fatherName} />
//                   {displayData.personalDetails.motherName && (
//                     <KeyValuePair label="Mother's Name" value={displayData.personalDetails.motherName} />
//                   )}
//                   <KeyValuePair label="Marital Status" value={displayData.personalDetails.maritalStatus} />
//                   {displayData.personalDetails.spouseName && (
//                     <KeyValuePair label="Spouse's Name" value={displayData.personalDetails.spouseName} />
//                   )}
//                 </Box>
//               </Box>
//             </Box>

//             {/* Card 2 - Contact */}
//             <Box
//               sx={{
//                 borderRadius: "10px",
//                 padding: "16px",
//                 backgroundColor: "#FFFFFF",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "12px",
//                 minHeight: "300px",
//               }}
//             >
//               {/* Header */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontFamily: "Mukta",
//                     fontWeight: 600,
//                     fontSize: "16px",
//                     lineHeight: "20px",
//                     color: "#3B3B3B",
//                     textTransform: "capitalize",
//                   }}
//                 >
//                   Contact
//                 </Typography>
//                 <IconButton
//                   onClick={() => handleEdit("contact")}
//                   disabled={isUpdating}
//                   sx={{
//                     width: "24px",
//                     height: "24px",
//                     borderRadius: "50%",
//                     boxShadow: "0px 1px 4px rgba(112, 112, 112, 0.2)",
//                     backgroundColor: "#FFFFFF",
//                     "&:hover": {
//                       backgroundColor: "#F5F5F5",
//                     },
//                     "&.Mui-disabled": {
//                       backgroundColor: "#F0F0F0",
//                     },
//                   }}
//                 >
//                   {isUpdating ? (
//                     <CircularProgress size={14} />
//                   ) : (
//                     <EditIcon sx={{ width: "14px", height: "14px", color: "#2A77D5" }} />
//                   )}
//                 </IconButton>
//               </Box>

//               {/* Content */}
//               <Box sx={{ flex: 1 }}>
//                 {/* CONTACT NUMBER Section */}
//                 <Typography
//                   sx={{
//                     fontFamily: "Mukta",
//                     fontWeight: 600,
//                     fontSize: "12px",
//                     lineHeight: "16px",
//                     color: "#707070",
//                     textTransform: "uppercase",
//                     mb: "8px",
//                   }}
//                 >
//                   CONTACT NUMBER
//                 </Typography>

//                 <Box sx={{ mb: "16px" }}>
//                   <KeyValuePair label="Phone Number" value={displayData.contactDetails.phoneNumber} />
//                   {displayData.contactDetails.alternateNumber && (
//                     <KeyValuePair label="Alternate" value={displayData.contactDetails.alternateNumber} />
//                   )}
//                 </Box>

//                 <Divider sx={{ borderColor: "#F0F0F0", mb: "16px" }} />

//                 {/* ADDRESS Section */}
//                 <Typography
//                   sx={{
//                     fontFamily: "Mukta",
//                     fontWeight: 600,
//                     fontSize: "12px",
//                     lineHeight: "16px",
//                     color: "#707070",
//                     textTransform: "uppercase",
//                     mb: "8px",
//                   }}
//                 >
//                   ADDRESS
//                 </Typography>

//                 <Box>
//                   <AddressKeyValuePair label="Local Address" value={localAddressString} />
//                   <AddressKeyValuePair label="Permanent Address" value={permanentAddressString} />
//                 </Box>
//               </Box>
//             </Box>

//             {/* Card 3 - Emergency Contact */}
//             <Box
//               sx={{
//                 borderRadius: "10px",
//                 padding: "16px",
//                 backgroundColor: "#FFFFFF",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "12px",
//                 minHeight: "150px",
//               }}
//             >
//               {/* Header */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontFamily: "Mukta",
//                     fontWeight: 600,
//                     fontSize: "16px",
//                     lineHeight: "20px",
//                     color: "#3B3B3B",
//                     textTransform: "capitalize",
//                   }}
//                 >
//                   Emergency Contact
//                 </Typography>
//                 <IconButton
//                   onClick={() => handleEdit("emergency")}
//                   disabled={isUpdating}
//                   sx={{
//                     width: "24px",
//                     height: "24px",
//                     borderRadius: "50%",
//                     boxShadow: "0px 1px 4px rgba(112, 112, 112, 0.2)",
//                     backgroundColor: "#FFFFFF",
//                     "&:hover": {
//                       backgroundColor: "#F5F5F5",
//                     },
//                     "&.Mui-disabled": {
//                       backgroundColor: "#F0F0F0",
//                     },
//                   }}
//                 >
//                   {isUpdating ? (
//                     <CircularProgress size={14} />
//                   ) : (
//                     <EditIcon sx={{ width: "14px", height: "14px", color: "#2A77D5" }} />
//                   )}
//                 </IconButton>
//               </Box>

//               {/* Content */}
//               <Box
//                 sx={{
//                   padding: "12px",
//                   borderRadius: "8px",
//                   backgroundColor: "#F7F7F7",
//                   flex: 1,
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontFamily: "Mukta",
//                     fontWeight: 600,
//                     fontSize: "14px",
//                     lineHeight: "16px",
//                     color: "#3B3B3B",
//                     mb: "4px",
//                   }}
//                 >
//                   {`${displayData.contactDetails.emergencyContact.firstName} ${displayData.contactDetails.emergencyContact.lastName}`.trim() ||
//                     "N/A"}
//                 </Typography>
//                 <Typography
//                   sx={{
//                     fontFamily: "Mukta",
//                     fontWeight: 600,
//                     fontSize: "12px",
//                     lineHeight: "16px",
//                     color: "#3B3B3B",
//                     mb: "4px",
//                   }}
//                 >
//                   {displayData.contactDetails.emergencyContact.relationship || "N/A"}
//                 </Typography>
//                 <Typography
//                   sx={{
//                     fontFamily: "Mukta",
//                     fontWeight: 400,
//                     fontSize: "12px",
//                     lineHeight: "16px",
//                     color: "#3B3B3B",
//                   }}
//                 >
//                   {displayData.contactDetails.emergencyContact.contactNumber || "N/A"}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Card 4 - Employment Details */}
//             <Box
//               sx={{
//                 borderRadius: "10px",
//                 padding: "16px",
//                 backgroundColor: "#FFFFFF",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "12px",
//                 minHeight: "150px",
//               }}
//             >
//               {/* Header */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontFamily: "Mukta",
//                     fontWeight: 600,
//                     fontSize: "16px",
//                     lineHeight: "20px",
//                     color: "#3B3B3B",
//                     textTransform: "capitalize",
//                   }}
//                 >
//                   Employment Details
//                 </Typography>
//                 <IconButton
//                   onClick={() => handleEdit("employment")}
//                   disabled={isUpdating}
//                   sx={{
//                     width: "24px",
//                     height: "24px",
//                     borderRadius: "50%",
//                     boxShadow: "0px 1px 4px rgba(112, 112, 112, 0.2)",
//                     backgroundColor: "#FFFFFF",
//                     "&:hover": {
//                       backgroundColor: "#F5F5F5",
//                     },
//                     "&.Mui-disabled": {
//                       backgroundColor: "#F0F0F0",
//                     },
//                   }}
//                 >
//                   {isUpdating ? (
//                     <CircularProgress size={14} />
//                   ) : (
//                     <EditIcon sx={{ width: "14px", height: "14px", color: "#2A77D5" }} />
//                   )}
//                 </IconButton>
//               </Box>

//               {/* Content */}
//               <Box sx={{ flex: 1 }}>
//                 <KeyValuePair label="Company ID" value={displayData.employmentDetails.companyId || ""} />
//                 <KeyValuePair
//                   label="Joining Date"
//                   value={formatDateOnly(displayData.employmentDetails.dateOfJoining)}
//                 />
//                 <KeyValuePair label="Designation" value={displayData.employmentDetails.designation || ""} />
//                 <KeyValuePair label="Assigned Area" value={displayData.employmentDetails.assignedArea || ""} />
//                 <KeyValuePair label="Area Manager" value={displayData.employmentDetails.areaManager || ""} />
//               </Box>
//             </Box>
//           </Box>

//           {/* Right Frame - Verified Documents */}
//           <Box
//             sx={{
//               flex: "0 0 350px",
//               borderRadius: "10px",
//               padding: "16px",
//               backgroundColor: "#FFFFFF",
//               display: "flex",
//               flexDirection: "column",
//               gap: "16px",
//               height: "fit-content",
//             }}
//           >
//             {/* Title */}
//             <Typography
//               sx={{
//                 fontFamily: "Mukta",
//                 fontWeight: 600,
//                 fontSize: "16px",
//                 lineHeight: "20px",
//                 color: "#575757",
//                 textTransform: "capitalize",
//               }}
//             >
//               Verified Documents
//             </Typography>

//             {/* Trust Score */}
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//                 gap: "32px",
//                 width: "313px",
//                 justifyContent: "center",
//                 height: "62px",
//               }}
//             >
//               <Box sx={{}}>
//                 {/* Logo */}
//                 <Box
//                   component="div"
//                   sx={{
//                     width: "67px",
//                     height: "62px",
//                     mb: 1,
//                     display: "flex",
//                     justifyContent: "center",
//                     color: "#2A77D5",
//                     fontWeight: "bold",
//                     flexDirection: "column",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Box>
//                     <img src="/logo.svg" alt="UpAndUp.Life Logo" className="w-[60px] h-[50px]" />
//                   </Box>
//                   <Typography
//                     variant="caption"
//                     sx={{ width: "67px", height: "10px", fontSize: "16px", fontWeight: "600", marginBottom: "5px" }}
//                   >
//                     UpAndUp
//                   </Typography>
//                   <Typography
//                     variant="caption"
//                     sx={{ width: "37px", height: "10px", fontSize: "16px", fontWeight: "500", paddingBottom: "10px" }}
//                   >
//                     Trust
//                   </Typography>
//                 </Box>
//               </Box>

//               <Box sx={{ paddingTop: "25px" }}>
//                 {/* Stars */}
//                 <Box sx={{ display: "flex", justifyContent: "center", gap: "1px", width: "80", height: "16" }}>
//                   {renderStars(displayData.upAndUpTrust || 0)}
//                 </Box>

//                 {/* Score */}
//                 <Typography
//                   sx={{
//                     width: "40",
//                     height: "20",
//                     fontFamily: "Mukta",
//                     fontWeight: 600,
//                     fontSize: "32px",
//                     lineHeight: "40px",
//                     color: "#575757",
//                     textAlign: "center",
//                   }}
//                 >
//                   {displayData.upAndUpTrust ? displayData.upAndUpTrust.toFixed(2) : "0.00"}
//                 </Typography>
//               </Box>
//             </Box>
//             {/* Line */}
//             <Divider sx={{ borderColor: "#F7F7F7" }} />

//             {/* Cross Checked Label */}
//             <Typography
//               sx={{
//                 fontFamily: "Mukta",
//                 fontWeight: 400,
//                 fontSize: "12px",
//                 lineHeight: "16px",
//                 color: "#575757",
//                 textTransform: "uppercase",
//               }}
//             >
//               CROSS CHECKED WITH GOVT
//             </Typography>

//             {/* Documents List */}
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "8px",
//                 maxHeight: "400px",
//                 overflowY: "auto",
//               }}
//             >
//               {displayData.documentVerification.documents.aadhaarCard && (
//                 <DocumentCard title="AADHAAR CARD" documentNumber="XXXXXXXXX6454" verified={true} image={null} />
//               )}
//               {displayData.documentVerification.documents.birthCertificate && (
//                 <DocumentCard title="BIRTH CERTIFICATE" documentNumber="XX/XX/XX58" verified={true} image={null} />
//               )}
//               {displayData.documentVerification.documents.educationCertificate && (
//                 <DocumentCard title="EDUCATION CERTIFICATE" documentNumber="XXXXXXX645" verified={true} image={null} />
//               )}
//               {displayData.documentVerification.documents.panCard && (
//                 <DocumentCard title="PAN CARD" documentNumber="XXXXX1234X" verified={true} image={null} />
//               )}
//             </Box>
//           </Box>
//         </Box>
//       </Box>

//       {/* Edit Dialog */}
//       <Dialog
//         open={editDialogOpen}
//         onClose={() => setEditDialogOpen(false)}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: "12px",
//             padding: "8px",
//             maxWidth: "600px",
//             width: "90%",
//           },
//         }}
//       >
//         <DialogContent sx={{ padding: "24px" }}>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               gap: "24px",
//             }}
//           >
//             {/* Dialog Header */}
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontFamily: "Mukta",
//                   fontWeight: 600,
//                   fontSize: "18px",
//                   color: "#2A77D5",
//                   textTransform: "capitalize",
//                 }}
//               >
//                 {editingSection === "personal"
//                   ? "Personal Details"
//                   : editingSection === "emergency"
//                     ? "Emergency Contact"
//                     : editingSection === "contact"
//                       ? "Contact Details"
//                       : editingSection === "employment"
//                         ? "Employment Details"
//                         : "Edit"}
//               </Typography>
//               <IconButton
//                 onClick={() => setEditDialogOpen(false)}
//                 sx={{
//                   width: "32px",
//                   height: "32px",
//                 }}
//               >
//                 <CloseIcon sx={{ color: "#707070" }} />
//               </IconButton>
//             </Box>

//             {/* Personal Section */}
//             {editingSection === "personal" && (
//               <>
//                 <Typography
//                   sx={{
//                     fontFamily: "Mukta",
//                     fontWeight: 600,
//                     fontSize: "14px",
//                     color: "#707070",
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   Basic Details
//                 </Typography>

//                 <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//                   <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
//                     <TextField
//                       label="First Name"
//                       variant="outlined"
//                       size="small"
//                       value={editFormData.firstName || ""}
//                       onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
//                       sx={{
//                         flex: "1 1 150px",
//                         "& .MuiInputLabel-root": {
//                           fontFamily: "Mukta",
//                         },
//                       }}
//                     />
//                     <TextField
//                       label="Middle Name"
//                       variant="outlined"
//                       size="small"
//                       value={editFormData.middleName || ""}
//                       onChange={(e) => setEditFormData({ ...editFormData, middleName: e.target.value })}
//                       sx={{
//                         flex: "1 1 150px",
//                         "& .MuiInputLabel-root": {
//                           fontFamily: "Mukta",
//                         },
//                       }}
//                     />
//                     <TextField
//                       label="Last Name"
//                       variant="outlined"
//                       size="small"
//                       value={editFormData.lastName || ""}
//                       onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
//                       sx={{
//                         flex: "1 1 150px",
//                         "& .MuiInputLabel-root": {
//                           fontFamily: "Mukta",
//                         },
//                       }}
//                     />
//                   </Box>

//                   <TextField
//                     label="Email"
//                     variant="outlined"
//                     size="small"
//                     type="email"
//                     value={editFormData.email || ""}
//                     onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
//                     sx={{
//                       "& .MuiInputLabel-root": {
//                         fontFamily: "Mukta",
//                       },
//                     }}
//                   />

//                   <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
//                     <TextField
//                       label="Date Of Birth"
//                       variant="outlined"
//                       size="small"
//                       type="date"
//                       value={editFormData.dateOfBirth || ""}
//                       onChange={(e) => setEditFormData({ ...editFormData, dateOfBirth: e.target.value })}
//                       sx={{
//                         flex: "1 1 150px",
//                         "& .MuiInputLabel-root": {
//                           fontFamily: "Mukta",
//                         },
//                       }}
//                       InputLabelProps={{
//                         shrink: true,
//                       }}
//                     />
//                     <FormControl size="small" sx={{ flex: "1 1 150px" }}>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           mb: "8px",
//                           color: "#707070",
//                           fontFamily: "Mukta",
//                           fontSize: "12px",
//                         }}
//                       >
//                         Sex
//                       </Typography>
//                       <Select
//                         value={editFormData.sex || ""}
//                         onChange={(e) => setEditFormData({ ...editFormData, sex: e.target.value })}
//                         sx={{ borderRadius: "4px" }}
//                       >
//                         <MenuItem value="MALE">Male</MenuItem>
//                         <MenuItem value="FEMALE">Female</MenuItem>
//                         <MenuItem value="OTHER">Other</MenuItem>
//                       </Select>
//                     </FormControl>
//                   </Box>

//                   <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
//                     <TextField
//                       label="Blood Group"
//                       variant="outlined"
//                       size="small"
//                       value={editFormData.bloodGroup || ""}
//                       onChange={(e) => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
//                       sx={{
//                         flex: "1 1 120px",
//                         "& .MuiInputLabel-root": {
//                           fontFamily: "Mukta",
//                         },
//                       }}
//                     />
//                     <TextField
//                       label="Nationality"
//                       variant="outlined"
//                       size="small"
//                       value={editFormData.nationality || ""}
//                       onChange={(e) => setEditFormData({ ...editFormData, nationality: e.target.value })}
//                       sx={{
//                         flex: "1 1 120px",
//                         "& .MuiInputLabel-root": {
//                           fontFamily: "Mukta",
//                         },
//                       }}
//                     />
//                   </Box>

//                   <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
//                     <TextField
//                       label="Height (cm)"
//                       variant="outlined"
//                       size="small"
//                       type="number"
//                       value={editFormData.height || ""}
//                       onChange={(e) => setEditFormData({ ...editFormData, height: e.target.value })}
//                       sx={{
//                         flex: "1 1 120px",
//                         "& .MuiInputLabel-root": {
//                           fontFamily: "Mukta",
//                         },
//                       }}
//                     />
//                     <TextField
//                       label="Weight (kg)"
//                       variant="outlined"
//                       size="small"
//                       type="number"
//                       value={editFormData.weight || ""}
//                       onChange={(e) => setEditFormData({ ...editFormData, weight: e.target.value })}
//                       sx={{
//                         flex: "1 1 120px",
//                         "& .MuiInputLabel-root": {
//                           fontFamily: "Mukta",
//                         },
//                       }}
//                     />
//                   </Box>

//                   <TextField
//                     label="Identification Mark"
//                     variant="outlined"
//                     size="small"
//                     value={editFormData.identificationMark || ""}
//                     onChange={(e) => setEditFormData({ ...editFormData, identificationMark: e.target.value })}
//                     sx={{
//                       "& .MuiInputLabel-root": {
//                         fontFamily: "Mukta",
//                       },
//                     }}
//                   />
//                 </Box>

//                 <Divider />

//                 <Typography
//                   sx={{
//                     fontFamily: "Mukta",
//                     fontWeight: 600,
//                     fontSize: "14px",
//                     color: "#707070",
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   Relations
//                 </Typography>

//                 <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
//                   <TextField
//                     label="Father's Name"
//                     variant="outlined"
//                     size="small"
//                     value={editFormData.fatherName || ""}
//                     onChange={(e) => setEditFormData({ ...editFormData, fatherName: e.target.value })}
//                     sx={{
//                       flex: "1 1 200px",
//                       "& .MuiInputLabel-root": {
//                         fontFamily: "Mukta",
//                       },
//                     }}
//                   />
//                   <TextField
//                     label="Mother's Name"
//                     variant="outlined"
//                     size="small"
//                     value={editFormData.motherName || ""}
//                     onChange={(e) => setEditFormData({ ...editFormData, motherName: e.target.value })}
//                     sx={{
//                       flex: "1 1 200px",
//                       "& .MuiInputLabel-root": {
//                         fontFamily: "Mukta",
//                       },
//                     }}
//                   />
//                 </Box>

//                 <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
//                   <FormControl size="small" sx={{ flex: "1 1 200px" }}>
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         mb: "8px",
//                         color: "#707070",
//                         fontFamily: "Mukta",
//                         fontSize: "12px",
//                       }}
//                     >
//                       Marital Status
//                     </Typography>
//                     <Select
//                       value={editFormData.maritalStatus || ""}
//                       onChange={(e) => setEditFormData({ ...editFormData, maritalStatus: e.target.value })}
//                       sx={{ borderRadius: "4px" }}
//                     >
//                       <MenuItem value="Single">Single</MenuItem>
//                       <MenuItem value="Married">Married</MenuItem>
//                       <MenuItem value="Divorced">Divorced</MenuItem>
//                       <MenuItem value="Widowed">Widowed</MenuItem>
//                     </Select>
//                   </FormControl>
//                   {editFormData.maritalStatus === "Married" && (
//                     <TextField
//                       label="Spouse's Name"
//                       variant="outlined"
//                       size="small"
//                       value={editFormData.spouseName || ""}
//                       onChange={(e) => setEditFormData({ ...editFormData, spouseName: e.target.value })}
//                       sx={{
//                         flex: "1 1 200px",
//                         "& .MuiInputLabel-root": {
//                           fontFamily: "Mukta",
//                         },
//                       }}
//                     />
//                   )}
//                 </Box>
//               </>
//             )}
//             {/* Contact Section */}
//             {editingSection === "contact" && (
//               <>
//                 <Typography
//                   sx={{
//                     fontFamily: "Mukta",
//                     fontWeight: 600,
//                     fontSize: "14px",
//                     color: "#707070",
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   Contact Number
//                 </Typography>

//                 <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
//                   <TextField
//                     label="Phone Number"
//                     variant="outlined"
//                     size="small"
//                     value={editFormData.phoneNumber || ""}
//                     onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
//                     sx={{
//                       flex: "1 1 200px",
//                       "& .MuiInputLabel-root": {
//                         fontFamily: "Mukta",
//                       },
//                     }}
//                   />
//                   <TextField
//                     label="Alternate Number"
//                     variant="outlined"
//                     size="small"
//                     value={editFormData.alternateNumber || ""}
//                     onChange={(e) => setEditFormData({ ...editFormData, alternateNumber: e.target.value })}
//                     sx={{
//                       flex: "1 1 200px",
//                       "& .MuiInputLabel-root": {
//                         fontFamily: "Mukta",
//                       },
//                     }}
//                   />
//                 </Box>

//                 <Divider />

//                 <Typography
//                   sx={{
//                     fontFamily: "Mukta",
//                     fontWeight: 600,
//                     fontSize: "14px",
//                     color: "#707070",
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   Local Address
//                 </Typography>

//                 <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//                   <TextField
//                     fullWidth
//                     label="Address Line 1"
//                     variant="outlined"
//                     size="small"
//                     value={editFormData.localAddress?.addressLine1 || ""}
//                     onChange={(e) =>
//                       setEditFormData({
//                         ...editFormData,
//                         localAddress: { ...editFormData.localAddress, addressLine1: e.target.value },
//                       })
//                     }
//                   />
//                   <TextField
//                     fullWidth
//                     label="Address Line 2"
//                     variant="outlined"
//                     size="small"
//                     value={editFormData.localAddress?.addressLine2 || ""}
//                     onChange={(e) =>
//                       setEditFormData({
//                         ...editFormData,
//                         localAddress: { ...editFormData.localAddress, addressLine2: e.target.value },
//                       })
//                     }
//                   />
//                   <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
//                     <TextField
//                       label="City"
//                       variant="outlined"
//                       size="small"
//                       value={editFormData.localAddress?.city || ""}
//                       onChange={(e) =>
//                         setEditFormData({
//                           ...editFormData,
//                           localAddress: { ...editFormData.localAddress, city: e.target.value },
//                         })
//                       }
//                       sx={{ flex: "1 1 150px" }}
//                     />
//                     <TextField
//                       label="District"
//                       variant="outlined"
//                       size="small"
//                       value={editFormData.localAddress?.district || ""}
//                       onChange={(e) =>
//                         setEditFormData({
//                           ...editFormData,
//                           localAddress: { ...editFormData.localAddress, district: e.target.value },
//                         })
//                       }
//                       sx={{ flex: "1 1 150px" }}
//                     />
//                     <TextField
//                       label="Pincode"
//                       variant="outlined"
//                       size="small"
//                       value={editFormData.localAddress?.pincode || ""}
//                       onChange={(e) =>
//                         setEditFormData({
//                           ...editFormData,
//                           localAddress: { ...editFormData.localAddress, pincode: e.target.value },
//                         })
//                       }
//                       sx={{ flex: "1 1 100px" }}
//                     />
//                   </Box>
//                   <TextField
//                     fullWidth
//                     label="State"
//                     variant="outlined"
//                     size="small"
//                     value={editFormData.localAddress?.state || ""}
//                     onChange={(e) =>
//                       setEditFormData({
//                         ...editFormData,
//                         localAddress: { ...editFormData.localAddress, state: e.target.value },
//                       })
//                     }
//                   />
//                   <TextField
//                     fullWidth
//                     label="Landmark"
//                     variant="outlined"
//                     size="small"
//                     value={editFormData.localAddress?.landmark || ""}
//                     onChange={(e) =>
//                       setEditFormData({
//                         ...editFormData,
//                         localAddress: { ...editFormData.localAddress, landmark: e.target.value },
//                       })
//                     }
//                   />
//                 </Box>

//                 <Divider />

//                 <Typography
//                   sx={{
//                     fontFamily: "Mukta",
//                     fontWeight: 600,
//                     fontSize: "14px",
//                     color: "#707070",
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   Permanent Address
//                 </Typography>

//                 <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//                   <TextField
//                     fullWidth
//                     label="Address Line 1"
//                     variant="outlined"
//                     size="small"
//                     value={editFormData.permanentAddress?.addressLine1 || ""}
//                     onChange={(e) =>
//                       setEditFormData({
//                         ...editFormData,
//                         permanentAddress: { ...editFormData.permanentAddress, addressLine1: e.target.value },
//                       })
//                     }
//                   />
//                   <TextField
//                     fullWidth
//                     label="Address Line 2"
//                     variant="outlined"
//                     size="small"
//                     value={editFormData.permanentAddress?.addressLine2 || ""}
//                     onChange={(e) =>
//                       setEditFormData({
//                         ...editFormData,
//                         permanentAddress: { ...editFormData.permanentAddress, addressLine2: e.target.value },
//                       })
//                     }
//                   />
//                   <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
//                     <TextField
//                       label="City"
//                       variant="outlined"
//                       size="small"
//                       value={editFormData.permanentAddress?.city || ""}
//                       onChange={(e) =>
//                         setEditFormData({
//                           ...editFormData,
//                           permanentAddress: { ...editFormData.permanentAddress, city: e.target.value },
//                         })
//                       }
//                       sx={{ flex: "1 1 150px" }}
//                     />
//                     <TextField
//                       label="District"
//                       variant="outlined"
//                       size="small"
//                       value={editFormData.permanentAddress?.district || ""}
//                       onChange={(e) =>
//                         setEditFormData({
//                           ...editFormData,
//                           permanentAddress: { ...editFormData.permanentAddress, district: e.target.value },
//                         })
//                       }
//                       sx={{ flex: "1 1 150px" }}
//                     />
//                     <TextField
//                       label="Pincode"
//                       variant="outlined"
//                       size="small"
//                       value={editFormData.permanentAddress?.pincode || ""}
//                       onChange={(e) =>
//                         setEditFormData({
//                           ...editFormData,
//                           permanentAddress: { ...editFormData.permanentAddress, pincode: e.target.value },
//                         })
//                       }
//                       sx={{ flex: "1 1 100px" }}
//                     />
//                   </Box>
//                   <TextField
//                     fullWidth
//                     label="State"
//                     variant="outlined"
//                     size="small"
//                     value={editFormData.permanentAddress?.state || ""}
//                     onChange={(e) =>
//                       setEditFormData({
//                         ...editFormData,
//                         permanentAddress: { ...editFormData.permanentAddress, state: e.target.value },
//                       })
//                     }
//                   />
//                   <TextField
//                     fullWidth
//                     label="Landmark"
//                     variant="outlined"
//                     size="small"
//                     value={editFormData.permanentAddress?.landmark || ""}
//                     onChange={(e) =>
//                       setEditFormData({
//                         ...editFormData,
//                         permanentAddress: { ...editFormData.permanentAddress, landmark: e.target.value },
//                       })
//                     }
//                   />
//                 </Box>
//               </>
//             )}
//             {/* Emergency Contact Section */}
//             {editingSection === "emergency" && (
//               <>
//                 <TextField
//                   fullWidth
//                   label="Full Name"
//                   variant="outlined"
//                   size="small"
//                   value={editFormData.contactName || ""}
//                   onChange={(e) => setEditFormData({ ...editFormData, contactName: e.target.value })}
//                   sx={{
//                     "& .MuiInputLabel-root": {
//                       fontFamily: "Mukta",
//                     },
//                   }}
//                 />

//                 <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
//                   <FormControl size="small" sx={{ flex: "1 1 200px" }}>
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         mb: "8px",
//                         color: "#707070",
//                         fontFamily: "Mukta",
//                         fontSize: "12px",
//                       }}
//                     >
//                       Relationship
//                     </Typography>
//                     <Select
//                       value={editFormData.relationship || ""}
//                       onChange={(e) => setEditFormData({ ...editFormData, relationship: e.target.value })}
//                       sx={{ borderRadius: "4px" }}
//                     >
//                       <MenuItem value="Brother">Brother</MenuItem>
//                       <MenuItem value="Sister">Sister</MenuItem>
//                       <MenuItem value="Father">Father</MenuItem>
//                       <MenuItem value="Mother">Mother</MenuItem>
//                       <MenuItem value="Spouse">Spouse</MenuItem>
//                       <MenuItem value="Friend">Friend</MenuItem>
//                       <MenuItem value="Other">Other</MenuItem>
//                     </Select>
//                   </FormControl>

//                   <TextField
//                     label="Contact Number"
//                     variant="outlined"
//                     size="small"
//                     value={editFormData.contactNumber || ""}
//                     onChange={(e) => setEditFormData({ ...editFormData, contactNumber: e.target.value })}
//                     sx={{
//                       flex: "1 1 200px",
//                       "& .MuiInputLabel-root": {
//                         fontFamily: "Mukta",
//                       },
//                     }}
//                   />
//                 </Box>
//               </>
//             )}
//             {/* Employment Section */}
//             {editingSection === "employment" && (
//               <>
//                 <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//                   <TextField
//                     fullWidth
//                     label="Company ID"
//                     variant="outlined"
//                     size="small"
//                     value={editFormData.companyId || ""}
//                     onChange={(e) => setEditFormData({ ...editFormData, companyId: e.target.value })}
//                     sx={{
//                       "& .MuiInputLabel-root": {
//                         fontFamily: "Mukta",
//                       },
//                     }}
//                   />

//                   <TextField
//                     fullWidth
//                     label="Date of Joining"
//                     variant="outlined"
//                     size="small"
//                     type="date"
//                     value={editFormData.dateOfJoining || ""}
//                     onChange={(e) => setEditFormData({ ...editFormData, dateOfJoining: e.target.value })}
//                     sx={{
//                       "& .MuiInputLabel-root": {
//                         fontFamily: "Mukta",
//                       },
//                     }}
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                   />

//                   <TextField
//                     fullWidth
//                     label="Designation"
//                     variant="outlined"
//                     size="small"
//                     value={editFormData.designation || ""}
//                     onChange={(e) => setEditFormData({ ...editFormData, designation: e.target.value })}
//                     sx={{
//                       "& .MuiInputLabel-root": {
//                         fontFamily: "Mukta",
//                       },
//                     }}
//                   />

//                   <FormControl size="small" fullWidth>
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         mb: "8px",
//                         color: "#707070",
//                         fontFamily: "Mukta",
//                         fontSize: "12px",
//                       }}
//                     >
//                       Assigned Duty Area
//                     </Typography>
//                     <Select
//                       value={editFormData.assignedArea || ""}
//                       onChange={(e) => setEditFormData({ ...editFormData, assignedArea: e.target.value })}
//                       sx={{ borderRadius: "4px" }}
//                     >
//                       <MenuItem value="North Delhi">North Delhi</MenuItem>
//                       <MenuItem value="South Delhi">South Delhi</MenuItem>
//                       <MenuItem value="South East Delhi">South East Delhi</MenuItem>
//                       <MenuItem value="South West Delhi">South West Delhi</MenuItem>
//                       <MenuItem value="East Delhi">East Delhi</MenuItem>
//                       <MenuItem value="West Delhi">West Delhi</MenuItem>
//                       <MenuItem value="Central Delhi">Central Delhi</MenuItem>
//                       <MenuItem value="New Delhi">New Delhi</MenuItem>
//                       <MenuItem value="Gurgaon">Gurgaon</MenuItem>
//                       <MenuItem value="Faridabad">Faridabad</MenuItem>
//                       <MenuItem value="Noida">Noida</MenuItem>
//                       <MenuItem value="Ghaziabad">Ghaziabad</MenuItem>
//                     </Select>
//                   </FormControl>

//                   <FormControl size="small" fullWidth>
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         mb: "8px",
//                         color: "#707070",
//                         fontFamily: "Mukta",
//                         fontSize: "12px",
//                       }}
//                     >
//                       Area Manager
//                     </Typography>
//                     <Select
//                       value={editFormData.areaManager || ""}
//                       onChange={(e) => setEditFormData({ ...editFormData, areaManager: e.target.value })}
//                       sx={{ borderRadius: "4px" }}
//                     >
//                       <MenuItem value="Sachin Sharma">Sachin Sharma</MenuItem>
//                       <MenuItem value="Anup Singh">Anup Singh</MenuItem>
//                       <MenuItem value="Vishesh Singh">Vishesh Singh</MenuItem>
//                       <MenuItem value="Prakash Kapoor">Prakash Kapoor</MenuItem>
//                       <MenuItem value="Prabh Kumar">Prabh Kumar</MenuItem>
//                       <MenuItem value="Rajesh Kumar">Rajesh Kumar</MenuItem>
//                       <MenuItem value="Amit Gupta">Amit Gupta</MenuItem>
//                       <MenuItem value="Suresh Yadav">Suresh Yadav</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Box>
//               </>
//             )}
//             {/* Action Buttons */}
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 mt: "16px",
//                 gap: "16px",
//                 flexWrap: "wrap",
//               }}
//             >
//               {/* Delete Button (only for personal section) */}
//               {editingSection === "personal" && (
//                 <Button
//                   variant="outlined"
//                   startIcon={<DeleteIcon />}
//                   onClick={handleDeleteProfile}
//                   sx={{
//                     color: "#E05952",
//                     borderColor: "#E05952",
//                     fontFamily: "Mukta",
//                     textTransform: "uppercase",
//                     fontSize: "12px",
//                     "&:hover": {
//                       borderColor: "#D32F2F",
//                       backgroundColor: "rgba(224, 89, 82, 0.04)",
//                     },
//                   }}
//                 >
//                   Delete Officer Profile
//                 </Button>
//               )}

//               {/* Save Button */}
//               <Button
//                 variant="contained"
//                 startIcon={
//                   isUpdating ? (
//                     <CircularProgress size={16} sx={{ color: "#ffffff" }} />
//                   ) : (
//                     <CheckIcon sx={{ color: "#ffffff" }} />
//                   )
//                 }
//                 onClick={handleSaveChanges}
//                 disabled={isUpdating}
//                 sx={{
//                   backgroundColor: "#2A77D5",
//                   fontFamily: "Mukta",
//                   textTransform: "uppercase",
//                   color: "#ffffff",
//                   fontSize: "12px",
//                   ml: "auto",
//                   "&:hover": {
//                     backgroundColor: "#1E5AA3",
//                   },
//                   "&.Mui-disabled": {
//                     backgroundColor: "#A0A0A0",
//                   },
//                 }}
//               >
//                 {isUpdating ? "Saving..." : "Save Changes"}
//               </Button>
//             </Box>
//           </Box>
//         </DialogContent>
//       </Dialog>

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default OfficerProfileWindow;

// File: src/components/OfficerProfileWindow.tsx
import { Alert, Box, Button, CircularProgress, Divider, Snackbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useOfficers } from "../../../context/OfficerContext";
import {
  useOfficerProfile,
  useUpdateOfficerContactDetails,
  useUpdateOfficerEmergencyContact,
  useUpdateOfficerEmploymentDetails,
  useUpdateOfficerPersonalDetails,
} from "../../../hooks/useOfficerProfile";
import type { APIOfficerProfile } from "../../../service/officers-api.service";
import OfficerContactDetailsCard from "../../OfficerProfile-subComponents/OfficerContactDetailsCard";
import {
  OfficerContactDetailsEditDialog,
  OfficerEmergencyContactEditDialog,
  OfficerEmploymentDetailsEditDialog,
  OfficerPersonalDetailsEditDialog,
} from "../../OfficerProfile-subComponents/OfficerEditDialogs";
import OfficerEmergencyContactCard from "../../OfficerProfile-subComponents/OfficerEmergencyContactCard";
import OfficerEmploymentDetailsCard from "../../OfficerProfile-subComponents/OfficerEmploymentDetailsCard";
import OfficerPersonalDetailsCard from "../../OfficerProfile-subComponents/OfficerPersonalDetailsCard";
import OfficerVerifiedDocumentsCard from "../../OfficerProfile-subComponents/OfficerVerifiedDocumentsCard";

// Officer Profile Window Component with modular structure
const OfficerProfileWindow: React.FC = () => {
  const { officerName } = useParams<{ officerName: string }>();
  const { getOfficerByName } = useOfficers();

  // State for officer identification - using guard ID
  const [guardId, setGuardId] = useState<string | null>(null);
  const [agencyId, setAgencyId] = useState<string | null>(null);

  // API hooks - they now use guard ID directly
  const {
    data: officerProfileData,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useOfficerProfile(guardId, agencyId);

  // Update hooks for different sections
  const personalDetailsUpdate = useUpdateOfficerPersonalDetails();
  const contactDetailsUpdate = useUpdateOfficerContactDetails();
  const emergencyContactUpdate = useUpdateOfficerEmergencyContact();
  const employmentDetailsUpdate = useUpdateOfficerEmploymentDetails();

  // Local state for UI
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<string>("");
  const [editFormData, setEditFormData] = useState<any>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Initialize guard ID and agency ID
  useEffect(() => {
    if (officerName) {
      const officer = getOfficerByName(officerName);
      if (officer) {
        // Use the guard ID directly from the officer object
        setGuardId(officer.guardId);
        setAgencyId(officer.currentAgencyId);

        console.log("🔍 Officer found for profile:", {
          name: officerName,
          referenceId: officer.id,
          guardId: officer.guardId, // This is what we'll use for API calls
          agencyId: officer.currentAgencyId,
        });
      } else {
        console.warn(`Officer not found for name: ${officerName}`);
      }
    }
  }, [officerName, getOfficerByName]);

  // Show snackbar for update results
  useEffect(() => {
    if (
      personalDetailsUpdate.isSuccess ||
      contactDetailsUpdate.isSuccess ||
      emergencyContactUpdate.isSuccess ||
      employmentDetailsUpdate.isSuccess
    ) {
      setSnackbar({
        open: true,
        message: "Officer profile updated successfully!",
        severity: "success",
      });
      setEditDialogOpen(false);
    }
  }, [
    personalDetailsUpdate.isSuccess,
    contactDetailsUpdate.isSuccess,
    emergencyContactUpdate.isSuccess,
    employmentDetailsUpdate.isSuccess,
  ]);

  // Show error snackbar
  useEffect(() => {
    const error =
      personalDetailsUpdate.error ||
      contactDetailsUpdate.error ||
      emergencyContactUpdate.error ||
      employmentDetailsUpdate.error;

    if (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update officer profile",
        severity: "error",
      });
    }
  }, [
    personalDetailsUpdate.error,
    contactDetailsUpdate.error,
    emergencyContactUpdate.error,
    employmentDetailsUpdate.error,
  ]);

  // Transform API data to display format
  const transformApiDataToDisplayFormat = (apiData: APIOfficerProfile) => {
    // Get addresses with proper null checks
    const permanentAddress = apiData.addresses?.find((addr) => addr.type === "PERMANENT");
    const localAddress =
      apiData.addresses?.find((addr) => addr.type === "CURRENT") ||
      apiData.addresses?.find((addr) => addr.type === "TEMPORARY") ||
      permanentAddress;

    // Get contacts with proper null checks
    const primaryContact = apiData.contacts?.find((contact) => contact.contactType === "PRIMARY");
    const alternateContact = apiData.contacts?.find((contact) => contact.contactType === "ALTERNATE");

    // Get family members with proper null checks and array validation
    const familyMembers = Array.isArray(apiData.familyMembers) ? apiData.familyMembers : [];
    const father = familyMembers.find((member) => member.relationshipType === "FATHER");
    const mother = familyMembers.find((member) => member.relationshipType === "MOTHER");
    const spouse = familyMembers.find((member) => member.relationshipType === "SPOUSE");

    // Get employment details with proper null checks
    const employments = Array.isArray(apiData.employments) ? apiData.employments : [];
    const currentEmployment = employments.find((emp) => emp.isCurrentEmployer);

    // Get documents with proper null checks
    const documents = Array.isArray(apiData.documents) ? apiData.documents : [];

    // Get emergency contacts with proper null checks
    const emergencyContacts = Array.isArray(apiData.emergencyContacts) ? apiData.emergencyContacts : [];

    return {
      personalDetails: {
        firstName: apiData.firstName || "",
        middleName: apiData.middleName || "",
        lastName: apiData.lastName || "",
        email: apiData.email || "",
        dateOfBirth: apiData.dateOfBirth || "",
        age: apiData.dateOfBirth
          ? Math.floor((Date.now() - new Date(apiData.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
          : 0,
        sex: apiData.sex || "",
        bloodGroup: apiData.bloodGroup || "",
        nationality: apiData.nationality || "",
        height: apiData.height?.toString() || "",
        weight: apiData.weight?.toString() || "",
        identificationMark: apiData.identificationMark || "",
        fatherName: father?.name || "",
        motherName: mother?.name || "",
        maritalStatus:
          apiData.martialStatus === "MARRIED"
            ? "Married"
            : apiData.martialStatus === "SINGLE"
              ? "Single"
              : apiData.martialStatus === "DIVORCED"
                ? "Divorced"
                : apiData.martialStatus === "WIDOWED"
                  ? "Widowed"
                  : "Other",
        spouseName: spouse?.name || "",
        profilePhoto: apiData.photo || "",
      },
      contactDetails: {
        phoneNumber: primaryContact?.phoneNumber || apiData.phoneNumber || "",
        alternateNumber: alternateContact?.phoneNumber || "",
        emergencyContact: {
          firstName: emergencyContacts[0]?.contactName?.split(" ")[0] || "",
          lastName: emergencyContacts[0]?.contactName?.split(" ").slice(1).join(" ") || "",
          relationship: emergencyContacts[0]?.relationship || "",
          contactNumber: emergencyContacts[0]?.phoneNumber || "",
        },
      },
      address: {
        localAddress: {
          addressLine1: localAddress?.line1 || "",
          addressLine2: localAddress?.line2 || "",
          city: localAddress?.city || "",
          district: localAddress?.district || "",
          pincode: localAddress?.pinCode || "",
          state: localAddress?.state || "",
          landmark: localAddress?.landmark || "",
        },
        permanentAddress: {
          addressLine1: permanentAddress?.line1 || "",
          addressLine2: permanentAddress?.line2 || "",
          city: permanentAddress?.city || "",
          district: permanentAddress?.district || "",
          pincode: permanentAddress?.pinCode || "",
          state: permanentAddress?.state || "",
          landmark: permanentAddress?.landmark || "",
        },
      },
      employmentDetails: {
        companyId: apiData.currentAgencyId || "",
        dateOfJoining: currentEmployment?.startDate || "",
        designation: currentEmployment?.position || "Area Officer",
        assignedArea: "Area Assignment", // This would come from another API field
        areaManager: "Area Manager", // This would come from another API field
      },
      documentVerification: {
        documents: {
          aadhaarCard: documents.some((doc) => doc.type === "AADHAR_CARD" || doc.type === "ID_CARD") || false,
          birthCertificate: documents.some((doc) => doc.type === "BIRTH_CERTIFICATE") || false,
          educationCertificate: documents.some((doc) => doc.type === "EDUCATION_CERTIFICATE") || false,
          panCard: documents.some((doc) => doc.type === "PAN_CARD") || false,
        },
      },
      upAndUpTrust: Math.random() * 2 + 3, // This would come from another API/calculation
    };
  };

  // Handle edit button click
  const handleEdit = (section: string) => {
    if (!officerProfileData) return;

    const displayData = transformApiDataToDisplayFormat(officerProfileData);
    setEditingSection(section);

    switch (section) {
      case "personal":
        setEditFormData({
          firstName: displayData.personalDetails.firstName,
          middleName: displayData.personalDetails.middleName,
          lastName: displayData.personalDetails.lastName,
          email: displayData.personalDetails.email,
          dateOfBirth: displayData.personalDetails.dateOfBirth
            ? displayData.personalDetails.dateOfBirth.split("T")[0]
            : "", // Extract date part only
          age: displayData.personalDetails.age,
          sex: displayData.personalDetails.sex,
          bloodGroup: displayData.personalDetails.bloodGroup,
          nationality: displayData.personalDetails.nationality,
          height: displayData.personalDetails.height,
          weight: displayData.personalDetails.weight,
          identificationMark: displayData.personalDetails.identificationMark,
          fatherName: displayData.personalDetails.fatherName,
          motherName: displayData.personalDetails.motherName,
          spouseName: displayData.personalDetails.spouseName,
          maritalStatus: displayData.personalDetails.maritalStatus,
        });
        break;
      case "contact":
        setEditFormData({
          phoneNumber: displayData.contactDetails.phoneNumber,
          alternateNumber: displayData.contactDetails.alternateNumber,
          localAddress: {
            addressLine1: displayData.address.localAddress.addressLine1,
            addressLine2: displayData.address.localAddress.addressLine2,
            city: displayData.address.localAddress.city,
            district: displayData.address.localAddress.district,
            pincode: displayData.address.localAddress.pincode, // Keep as pincode for form
            state: displayData.address.localAddress.state,
            landmark: displayData.address.localAddress.landmark,
          },
          permanentAddress: {
            addressLine1: displayData.address.permanentAddress.addressLine1,
            addressLine2: displayData.address.permanentAddress.addressLine2,
            city: displayData.address.permanentAddress.city,
            district: displayData.address.permanentAddress.district,
            pincode: displayData.address.permanentAddress.pincode, // Keep as pincode for form
            state: displayData.address.permanentAddress.state,
            landmark: displayData.address.permanentAddress.landmark,
          },
        });
        break;
      case "emergency":
        setEditFormData({
          contactName:
            `${displayData.contactDetails.emergencyContact.firstName} ${displayData.contactDetails.emergencyContact.lastName}`.trim(),
          relationship: displayData.contactDetails.emergencyContact.relationship,
          contactNumber: displayData.contactDetails.emergencyContact.contactNumber,
        });
        break;
      case "employment":
        setEditFormData({
          companyId: displayData.employmentDetails.companyId,
          dateOfJoining: displayData.employmentDetails.dateOfJoining
            ? displayData.employmentDetails.dateOfJoining.split("T")[0]
            : "",
          designation: displayData.employmentDetails.designation,
          assignedArea: displayData.employmentDetails.assignedArea,
          areaManager: displayData.employmentDetails.areaManager,
        });
        break;
      default:
        setEditFormData({});
    }
    setEditDialogOpen(true);
  };

  // Handle save changes using guard ID
  const handleSaveChanges = async () => {
    if (!guardId || !agencyId) {
      setSnackbar({
        open: true,
        message: "Missing guard or agency information",
        severity: "error",
      });
      return;
    }

    try {
      switch (editingSection) {
        case "personal":
          await personalDetailsUpdate.updatePersonalDetails(guardId, agencyId, {
            firstName: editFormData.firstName,
            middleName: editFormData.middleName,
            lastName: editFormData.lastName,
            email: editFormData.email,
            dateOfBirth: editFormData.dateOfBirth,
            sex: editFormData.sex,
            bloodGroup: editFormData.bloodGroup,
            nationality: editFormData.nationality,
            height: editFormData.height ? parseInt(editFormData.height) : undefined,
            weight: editFormData.weight ? parseInt(editFormData.weight) : undefined,
            identificationMark: editFormData.identificationMark,
            fatherName: editFormData.fatherName,
            motherName: editFormData.motherName,
            spouseName: editFormData.spouseName,
            maritalStatus: editFormData.maritalStatus,
          });
          break;

        case "contact":
          await contactDetailsUpdate.updateContactDetails(guardId, agencyId, {
            phoneNumber: editFormData.phoneNumber,
            alternateNumber: editFormData.alternateNumber,
            addresses: {
              permanent: {
                addressLine1: editFormData.permanentAddress?.addressLine1 || "",
                addressLine2: editFormData.permanentAddress?.addressLine2 || "",
                city: editFormData.permanentAddress?.city || "",
                district: editFormData.permanentAddress?.district || "",
                state: editFormData.permanentAddress?.state || "",
                pincode: editFormData.permanentAddress?.pincode || "", // Keep as pincode for form
                landmark: editFormData.permanentAddress?.landmark || "",
              },
              local: {
                addressLine1: editFormData.localAddress?.addressLine1 || "",
                addressLine2: editFormData.localAddress?.addressLine2 || "",
                city: editFormData.localAddress?.city || "",
                district: editFormData.localAddress?.district || "",
                state: editFormData.localAddress?.state || "",
                pincode: editFormData.localAddress?.pincode || "", // Keep as pincode for form
                landmark: editFormData.localAddress?.landmark || "",
              },
            },
          });
          break;

        case "emergency":
          await emergencyContactUpdate.updateEmergencyContact(guardId, agencyId, {
            contactName: editFormData.contactName,
            relationship: editFormData.relationship,
            phoneNumber: editFormData.contactNumber,
          });
          break;

        case "employment":
          await employmentDetailsUpdate.updateEmploymentDetails(guardId, agencyId, {
            position: editFormData.designation,
            startDate: editFormData.dateOfJoining,
            assignedArea: editFormData.assignedArea,
            designation: editFormData.designation,
            areaManager: editFormData.areaManager,
          });
          break;

        default:
          throw new Error("Unknown section for update");
      }
    } catch (error: any) {
      console.error("Error saving officer changes:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to save changes",
        severity: "error",
      });
    }
  };

  // Early return if guard ID is not available
  if (!guardId || !agencyId) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          padding: "24px",
          borderRadius: "12px",
          background: "#F7F7F7",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Mukta",
            fontSize: "20px",
            fontWeight: 500,
            color: "#707070",
          }}
        >
          Initializing officer profile...
        </Typography>
      </Box>
    );
  }

  // Loading state
  if (profileLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          padding: "24px",
          borderRadius: "12px",
          background: "#F7F7F7",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress color="primary" size={48} />
        <Typography
          sx={{
            fontFamily: "Mukta",
            fontSize: "20px",
            fontWeight: 500,
            color: "#707070",
          }}
        >
          Loading officer profile...
        </Typography>
        <Typography
          sx={{
            fontFamily: "Mukta",
            fontSize: "14px",
            color: "#A0A0A0",
          }}
        >
          Fetching details using guard ID: {guardId}
        </Typography>
      </Box>
    );
  }

  // Error state
  if (profileError) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          padding: "24px",
          borderRadius: "12px",
          background: "#F7F7F7",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {profileError.message}
        </Alert>
        <Button
          variant="contained"
          onClick={() => refetchProfile()}
          sx={{
            backgroundColor: "#2A77D5",
            "&:hover": { backgroundColor: "#1E5AA3" },
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // No data state
  if (!officerProfileData) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          padding: "24px",
          borderRadius: "12px",
          background: "#F7F7F7",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Mukta",
            fontSize: "20px",
            fontWeight: 500,
            color: "#707070",
          }}
        >
          No officer profile data available
        </Typography>
      </Box>
    );
  }

  // Transform API data for display
  const displayData = transformApiDataToDisplayFormat(officerProfileData);

  const isUpdating =
    personalDetailsUpdate.isLoading ||
    contactDetailsUpdate.isLoading ||
    emergencyContactUpdate.isLoading ||
    employmentDetailsUpdate.isLoading;

  return (
    <Box
      sx={{
        width: "1052px",
        minHeight: "840px",
        padding: "24px",
        borderRadius: "12px",
        background: "#F7F7F7",
      }}
    >
      {/* Main Content Container */}
      <Box
        sx={{
          width: "1020px",
          height: "808px",
          margin: "0 auto",
          gap: "24px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Content Heading */}
        <Box sx={{ width: "1020px", height: "32px", gap: "8px" }}>
          <Typography
            sx={{
              fontFamily: "Mukta",
              fontWeight: 600,
              fontSize: "24px",
              lineHeight: "32px",
              textTransform: "capitalize",
              color: "#3B3B3B",
              mb: "8px",
            }}
          >
            Officer Profile
          </Typography>
          <Divider sx={{ borderColor: "#FFFFFF", width: "1020px" }} />
        </Box>

        {/* Content */}
        <Box
          sx={{
            width: "1020px",
            height: "752px",
            display: "flex",
            gap: "12px",
          }}
        >
          {/* Left Frame - Cards */}
          <Box
            sx={{
              flex: "1 1 700px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "16px",
              alignContent: "start",
            }}
          >
            {/* Personal Details Card */}
            <OfficerPersonalDetailsCard
              personalDetails={displayData.personalDetails}
              onEdit={() => handleEdit("personal")}
              isUpdating={isUpdating}
            />

            {/* Contact Details Card */}
            <OfficerContactDetailsCard
              contactDetails={displayData.contactDetails}
              address={displayData.address}
              onEdit={() => handleEdit("contact")}
              isUpdating={isUpdating}
            />

            {/* Emergency Contact Card */}
            <OfficerEmergencyContactCard
              emergencyContact={displayData.contactDetails.emergencyContact}
              onEdit={() => handleEdit("emergency")}
              isUpdating={isUpdating}
            />

            {/* Employment Details Card */}
            <OfficerEmploymentDetailsCard
              employmentDetails={displayData.employmentDetails}
              onEdit={() => handleEdit("employment")}
              isUpdating={isUpdating}
            />
          </Box>

          {/* Right Frame - Verified Documents */}
          <OfficerVerifiedDocumentsCard
            documents={displayData.documentVerification.documents}
            upAndUpTrust={displayData.upAndUpTrust}
          />
        </Box>
      </Box>

      {/* Edit Dialogs */}
      <OfficerPersonalDetailsEditDialog
        open={editDialogOpen && editingSection === "personal"}
        onClose={() => setEditDialogOpen(false)}
        formData={editFormData}
        setFormData={setEditFormData}
        onSave={handleSaveChanges}
        isLoading={isUpdating}
      />

      <OfficerContactDetailsEditDialog
        open={editDialogOpen && editingSection === "contact"}
        onClose={() => setEditDialogOpen(false)}
        formData={editFormData}
        setFormData={setEditFormData}
        onSave={handleSaveChanges}
        isLoading={isUpdating}
      />

      <OfficerEmergencyContactEditDialog
        open={editDialogOpen && editingSection === "emergency"}
        onClose={() => setEditDialogOpen(false)}
        formData={editFormData}
        setFormData={setEditFormData}
        onSave={handleSaveChanges}
        isLoading={isUpdating}
      />

      <OfficerEmploymentDetailsEditDialog
        open={editDialogOpen && editingSection === "employment"}
        onClose={() => setEditDialogOpen(false)}
        formData={editFormData}
        setFormData={setEditFormData}
        onSave={handleSaveChanges}
        isLoading={isUpdating}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OfficerProfileWindow;
