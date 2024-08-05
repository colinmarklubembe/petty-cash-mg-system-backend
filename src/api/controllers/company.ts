import { Request, Response } from "express";
import { mapStringToEnum, responses } from "../../utils";
import { companyService } from "../services";
import userService from "../auth/services/userService";
import { Role } from "@prisma/client";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
  company?: { companyId: string };
}

class CompanyController {
  async createCompany(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { name, address, phone, companyEmail } = req.body;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const data = {
        name,
        address,
        phoneNumber: phone,
        companyEmail,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const company = await companyService.createCompany(data);
      const userId = user.id;
      const companyId = company.id;
      const role = Role.ADMIN;

      await companyService.addUserToCompany(userId, companyId, role);

      const updatedUser = await userService.findUserById(userId);

      return responses.successResponse(
        res,
        201,
        "Company created successfully",
        { company: company, user: updatedUser }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async getUserCompany(req: AuthenticatedRequest, res: Response) {
    try {
      const { companyId } = req.company!;
      const { email } = req.user!;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const userId = user.id;

      const userCompany = await companyService.getUserCompany(
        userId,
        companyId
      );

      if (!userCompany) {
        return responses.errorResponse(
          res,
          404,
          "User does not belong to company"
        );
      }

      return responses.successResponse(
        res,
        200,
        "Company retrieved successfully",
        userCompany
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async getCompanyById(req: AuthenticatedRequest, res: Response) {
    try {
      const { companyId } = req.params;

      const company = await companyService.getCompany(companyId);

      if (!company) {
        return responses.errorResponse(res, 404, "Company not found");
      }

      return responses.successResponse(
        res,
        200,
        "Company retrieved successfully",
        company
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async updateCompany(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { companyId } = req.params!;
      const { name, address, phone, companyEmail } = req.body;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      // get user company
      const userCompany = await companyService.getUserCompany(
        user.id,
        companyId
      );

      if (!userCompany) {
        return responses.errorResponse(
          res,
          404,
          "User does not belong to company"
        );
      }

      if (userCompany.role !== Role.ADMIN) {
        return responses.errorResponse(
          res,
          403,
          "Only the company admin can update company details"
        );
      }

      const newData = {
        name,
        address,
        phoneNumber: phone,
        companyEmail,
        updatedAt: new Date().toISOString(),
      };

      const company = await companyService.updateCompany(companyId, newData);

      return responses.successResponse(
        res,
        200,
        "Company updated successfully",
        company
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async deleteCompany(req: AuthenticatedRequest, res: Response) {
    try {
      const { companyId } = req.company!;

      await companyService.deleteCompany(companyId);

      return responses.successResponse(
        res,
        200,
        "Company deleted successfully"
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async getUserCompanies(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }
      const userId = user.id;

      const companies = await companyService.getUserCompanies(userId);

      return responses.successResponse(
        res,
        200,
        "Companies retrieved successfully",
        { companies: companies }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async addUserToCompany(req: AuthenticatedRequest, res: Response) {
    try {
      const { companyId } = req.company!;
      const { email, role } = req.body;

      const user = await userService.findUserByEmail(email);
      const userId = user.id;

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const userCompany = await companyService.getUserCompany(
        userId,
        companyId
      );

      if (userCompany) {
        return responses.errorResponse(
          res,
          404,
          "User already belongs to company"
        );
      }

      let mappedRole: any;
      mappedRole = mapStringToEnum.mapStringToRole(res, role);

      await companyService.addUserToCompany(userId, companyId, mappedRole);

      return responses.successResponse(
        res,
        200,
        "User added to company successfully"
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async removeUserFromCompany(req: AuthenticatedRequest, res: Response) {
    try {
      const { companyId } = req.company!;
      const { email } = req.body;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const userId = user.id;

      const userCompany = await companyService.getUserCompany(
        userId,
        companyId
      );

      if (!userCompany) {
        return responses.errorResponse(
          res,
          404,
          "User does not belong to company"
        );
      }

      await companyService.removeUserFromCompany(userId, companyId);

      return responses.successResponse(
        res,
        200,
        "User removed from company successfully"
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async selectCompany(req: Request, res: Response) {
    try {
      const { companyId } = req.params;

      const company = await companyService.getCompany(companyId);

      if (!company) {
        return responses.errorResponse(res, 404, "Organization not found");
      }

      res.setHeader("companyId", `${company.id}`);

      responses.successResponse(
        res,
        200,
        `Organization ${company.name} selected successfully`,
        {
          company: company,
        }
      );
    } catch (error: any) {
      responses.errorResponse(res, 500, error.message);
    }
  }
}

export default new CompanyController();
