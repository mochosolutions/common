import fs from 'fs/promises';
import path from 'path';

export const createJsonFile = async (data: any, filePath: any) => {
    try {
      // Convert the data to a JSON string
      
      const jsonData = JSON.stringify(data, null, 2); // The 'null, 2' arguments format the JSON with 2-space indentation
      console.log("Current directory:", __dirname);

      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });


      // Write the JSON data to the file
      await fs.writeFile(filePath, jsonData);
  
      console.log(`JSON data has been written to ${filePath}`);
    } catch (error: any) {
      console.error(`Error writing JSON file: ${error.message}`);
    }
}

export const readFileAsync = async (filePath: string) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error: any) {
    throw new Error(`Error reading data file: ${error.message}`);
  }
}
