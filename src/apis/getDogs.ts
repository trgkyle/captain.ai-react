import { v4 as uuidv4 } from "uuid";
import { DogType } from "../interfaces";
const dogCeoApiURL = "https://dog.ceo/api";

export async function getDogsAPI(amount: number): Promise<DogType[]> {
  try {
    const response = await fetch(
      `${dogCeoApiURL}/breeds/image/random/${amount}`
    );
    const data = await response.json();
    return data.message.map((url: string) => ({
      id: uuidv4(),
      url,
    }));
  } catch (error: any) {
    console.error("Error loading images:", error);
    return [];
  }
}
