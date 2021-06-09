import { Label } from "../models/label.model";
import HttpService, { ResponseType } from "./http.service";

type LabelListResponseType = ResponseType & {
  data?: Label[];
};

type LabelResponseType = ResponseType & {
  data?: Label;
};

export default class LabelService {
  public static async getLabels(): Promise<LabelListResponseType> {
    return await new HttpService<LabelListResponseType>().get("labels");
  }

  public static async getLabelDetails(id: string): Promise<LabelResponseType> {
    return await new HttpService<LabelResponseType>().get(`labels/${id}`);
  }
}
