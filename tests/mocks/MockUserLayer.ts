import IUserLayer from "../../src/UserService/layers/IUserLayer";
import IUserModel from "../../src/UserService/models/IUserModel";
import MockUserModel from "./MockUserModel";
import IUser from "../../src/UserService/models/IUser";
import INewUserData from "../../src/UserService/Layers/INewUserData";

export default class MockUserLayer implements IUserLayer {
    private userModel : IUserModel;

    constructor(userModel: MockUserModel) {
        this.userModel = userModel;
    }

    public async getUserInfo(id: number) : Promise<IUser> {
        return this.userModel.getByID(id);
    }

    public async subscribe(user : IUser) : Promise<IUser> {
        return this.userModel.getByID(user.getID());
    }

    public async unsubscribe(user : IUser) : Promise<IUser> {
        return this.userModel.getByID(user.getID());
    }

    public async createUser(newUserData : INewUserData) : Promise<IUser> {
        return this.userModel.create(newUserData);
    }

    public async deleteUser(id : number) : Promise<IUser> {
        return this.userModel.delete(id);
    }
}