import  MyTokenUser  from "./MyTokenUser"

export class MyToken  {
    user:MyTokenUser;
    refreshToken:string;
    payload: any;

    constructor(user:MyTokenUser, refreshToken:string) {
      
      this.user = user;
      this.refreshToken = refreshToken;
    }
}

