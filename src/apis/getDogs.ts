const dogCeoApiURL = "https://dog.ceo/api";

export async function getDogsAPI(amount: number) {
  try {
    const response = await fetch(
      `${dogCeoApiURL}/breeds/image/random/${amount}`
    );
    const data = await response.json();
    return data.message;
  } catch (error: any) {
    console.error("Error loading images:", error);
    return [];
  }
}
