import { nanoid } from "nanoid";
import { StoreData } from "./API";

const clients = ["Client A", "Client B", "Client C", "Client D"];
const boards = ["Board A", "Board B", "Board C", "Board D"];
const tags = ["Tag A", "Tag B", "Tag C", "Tag D"];
const requestors = ["Requestor A", "Requestor B", "Requestor C", "Requestor D"];
const scripts = ["Script A", "Script B", "Script C", "Script D"];
const actions = ["Action A", "Action B", "Action C", "Action D"];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function mockData(): StoreData {
  const data: StoreData = {
    id: nanoid(),
    client: getRandomItem(clients),
    board: getRandomItem(boards),
    tags: getRandomItem(tags),
    requestor: getRandomItem(requestors),
    script: getRandomItem(scripts),
    actions: getRandomItem(actions),
  };

  return data;
}

const defaultData: StoreData[] = [];

const generateDefaultData = () => {
  for (let i = 0; i < 20; i++) {
    defaultData.push(mockData());
  }
  return defaultData;
};

export default generateDefaultData;
