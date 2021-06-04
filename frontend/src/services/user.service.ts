import HttpService, { ResponseType } from "./http.service";

type LoginRequestParams = {
  email: string;
  password: string;
};

type LoginResponseType = ResponseType & {
  data?: {
    tokens: {
      IdToken: string;
    };
  };
};

type RegisterRequestParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type RegisterResponseType = ResponseType & {
  data?: {
    id: string;
  };
};

export default class UserService {
  public static async login(
    data: LoginRequestParams
  ): Promise<LoginResponseType> {
    return await new HttpService<LoginResponseType>().post("auth/login", data);
  }

  public static async register(
    data: RegisterRequestParams
  ): Promise<RegisterResponseType> {
    return await new HttpService<RegisterResponseType>().post(
      "auth/register",
      data
    );
  }
}
