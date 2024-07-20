import { AppDataSource } from "../models/config/data-source";
import { Requisition } from "../models/entities/Requisition";
import { RequisitionStatus } from "../models/enums/RequisitionStatus";
import { ObjectId } from "mongodb";

class RequisitionService {
  private requisitionRepository = AppDataSource.getMongoRepository(Requisition);

  async createRequisition(data: Partial<Requisition>): Promise<Requisition> {
    const requisition = this.requisitionRepository.create(data);
    return await this.requisitionRepository.save(requisition);
  }

  async updateRequisition(
    requisitionId: string,
    newData: any
  ): Promise<Requisition | null> {
    const objectId = new ObjectId(requisitionId);
    const result = await this.requisitionRepository.findOneAndUpdate(
      { _id: objectId },
      { $set: newData },
      { returnDocument: "after" }
    );
    const updatedRequisition = result?.value;

    return updatedRequisition;
  }

  async findRequisitionById(
    requisitionId: string
  ): Promise<Requisition | null> {
    const objectId = new ObjectId(requisitionId);

    // Use MongoDB's findOne to find and return the requisition including the user
    return this.requisitionRepository.findOneBy({
      where: { _id: objectId },
    });
  }
}

export default new RequisitionService();
