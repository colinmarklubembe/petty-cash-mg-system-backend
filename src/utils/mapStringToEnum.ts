// import {
//   UserType,
//   LeadStatus,
//   BusinessType,
//   ServiceCategory,
//   VisitType,
// } from "@prisma/client";
// import { Response } from "express";

// class Mapper {
//   mapStringToUserType = (
//     userType: string,
//     res: Response
//   ): UserType | Response<any> => {
//     switch (userType.toUpperCase()) {
//       case "OWNER":
//         return UserType.OWNER;
//       case "ADMIN":
//         return UserType.ADMIN;
//       case "USER":
//         return UserType.USER;
//       default:
//         return res
//           .status(400)
//           .json({ success: false, error: "Invalid user type" });
//     }
//   };

//   mapStringToLeadStatus = (
//     leadStatus: string,
//     res: Response
//   ): LeadStatus | Response<any> => {
//     switch (leadStatus.toUpperCase()) {
//       case "LEAD":
//         return LeadStatus.LEAD;
//       case "QUALIFIED":
//         return LeadStatus.QUALIFIED;
//       case "PROSPECT":
//         return LeadStatus.PROSPECT;
//       case "CLOSED":
//         return LeadStatus.CLOSED;
//       default:
//         return res
//           .status(400)
//           .json({ success: false, error: "Invalid lead status" });
//     }
//   };

//   mapStringToBusinessType = (
//     businessType: string,
//     res: Response
//   ): BusinessType | Response<any> => {
//     switch (businessType.toUpperCase()) {
//       case "ENTERPRISE":
//         return BusinessType.ENTERPRISE;
//       case "HOME":
//         return BusinessType.HOME;
//       case "SOLUTIONS":
//         return BusinessType.SOLUTIONS;
//       default:
//         return res
//           .status(400)
//           .json({ success: false, error: "Invalid business type" });
//     }
//   };

//   mapStringToServiceCategory = (
//     serviceCategory: string,
//     res: Response
//   ): ServiceCategory | Response<any> => {
//     switch (serviceCategory.toUpperCase()) {
//       case "ENTERPRISE":
//         return ServiceCategory.ENTERPRISE;
//       case "HOME":
//         return ServiceCategory.HOME;
//       case "SOLUTIONS":
//         return ServiceCategory.SOLUTIONS;
//       default:
//         return res
//           .status(400)
//           .json({ success: false, error: "Invalid service category" });
//     }
//   };

//   mapStringToVisitType = (
//     visitType: string,
//     res: Response
//   ): VisitType | Response<any> => {
//     switch (visitType.toUpperCase()) {
//       case "NEW":
//         return VisitType.NEW;
//       case "FOLLOW_UP":
//         return VisitType.FOLLOW_UP;
//       default:
//         return res
//           .status(400)
//           .json({ success: false, error: "Invalid visit type" });
//     }
//   };
// }

// export default new Mapper();
