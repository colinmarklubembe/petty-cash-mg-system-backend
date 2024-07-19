import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: "mongodb+srv://colinlubembe68:colin1234@cluster0.wikqkcm.mongodb.net/petty_cash_db?retryWrites=true&w=majority",
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
