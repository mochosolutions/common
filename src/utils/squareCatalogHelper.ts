import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { 
  Client,
  Environment,
  CatalogApi,
  CatalogObject,
  BatchUpsertCatalogObjectsRequest,
  ApiError,
  FileWrapper,
 } from "square";
import { NormalizedItems, NormalizedVariants, ImageMatchObj, MatchedResult, UnmatchedItem } from "../types"

dotenv.config()

// const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN ?? ""

// const client = new Client({
//     accessToken: SQUARE_ACCESS_TOKEN,
//     environment: Environment.Production,
// });

// const { catalogApi } = client;


export const initializeSquareClient = (squareAccessToken: string) => {

  const client = new Client({
    accessToken: squareAccessToken,
    environment: Environment.Production,
  });

  return client.catalogApi;
};

export const createUniqueUUID = () => {
  return uuidv4()
}

export const  processNumber = (num: number) => {
  if (Number.isInteger(num)) {
      return BigInt(num * 100);
  } else if (typeof num === 'number') {
      const decimalPart = parseInt(num.toString().split('.')[1]);
      const integerPart = Math.floor(num);
      return BigInt(integerPart * 100 + decimalPart);
  } else {
      throw new Error("Input must be an integer or float");
  }
}

export const listCatalogItems = async (catalogApi: CatalogApi, objectType: string = 'ITEM') => {
  let limit = 100;
  let allItems: CatalogObject[] = [];

  try {
    let listCatalogResponse = await catalogApi.listCatalog(
      undefined,
      objectType
    );

    while (listCatalogResponse.result.objects && listCatalogResponse.result.objects.length > 0) {
      let items = listCatalogResponse.result.objects;
      allItems = allItems.concat(items);

      let cursor = listCatalogResponse.result.cursor;
      if (cursor) {
        listCatalogResponse = await catalogApi.listCatalog(
          cursor,
          objectType
        );
      } else {
        break;
      }
    }

    return allItems

  } catch (error) {
    if (error instanceof ApiError) {
      error.result.errors.forEach(function (e: any) {
        console.log(e.category);
        console.log(e.code);
        console.log(e.detail);
      });
    } else {
      console.log("Unexpected error occurred: ", error);
    }
  }
};


// limit the objects to 10,000
// check if I can upload custom fields
// add product update using csv
// add validation for required fields
export const createCatalogObject = (products: any[]) => {
  const catalogBatch = [];
  for (let product of products){
      const object = {
          "type": "ITEM",
          "id": `#${product['productCode']}`,
          // "image_data": 
          "itemData": {
              "name": product['friendlyName'],
              "descriptionHtml": product['techSpecs'],
              // "product_type": product['productType'],
              "variations": [
                  {
                      "type": "ITEM_VARIATION",
                      "id": `#${uuidv4()}`,
  
                      "itemVariationData": {
                          // "itemId": `#${product['productCode']}`,
                          "name": product['friendlyName'],
                          "pricingType": "FIXED_PRICING",
                          "priceMoney": {
                              "amount":  processNumber(product['price']),
                              "currency": "USD"
                          }
                      }
                  },
              ],
          }
      }
      catalogBatch.push(object)
  }
  return catalogBatch;
}


export const batchDeleteCatalog = async (catalogApi: CatalogApi, catalogObjectIds: string[], batchSize: number) => {

  try {
    let deletedResults: string[] = []
    const arr = catalogObjectIds;
    for (let i = 0; i < arr.length; i += batchSize) {
      const batch = arr.slice(i, i + batchSize);
      const body = { objectIds: batch }
      const { result, ...httpResponse } = await catalogApi.batchDeleteCatalogObjects(body);
      deletedResults = deletedResults.concat(result?.deletedObjectIds!);
    }

    return deletedResults;

  } catch (error) {
    console.error("Square Error", error);
    if (error instanceof ApiError) {
      console.error("Square Error", error);
    }
  }
}



export const deleteAllCatalogItems = async (catalogApi: CatalogApi, objectType: string = 'ITEM') => {
  try {
    const arr = await listCatalogItems(catalogApi, objectType);
    const catalogObjectIds = arr?.map((item: CatalogObject) => item.id);
    const deletedObjects = await batchDeleteCatalog(catalogApi, catalogObjectIds!, 200);
  } catch (error) {
    console.error("Unexpected error in deleteAllCatalogItems occurred: ", error);
  }
}


export const uploadProductsToSquare = async (products: any[], catalogApi: CatalogApi) => {
  try{
      const catalogBatch = createCatalogObject(products);
      const body: BatchUpsertCatalogObjectsRequest = {
          idempotencyKey: `${uuidv4()}`,
          batches: [{ objects: catalogBatch }]
      }
      const { result, ...httpResponse } = await catalogApi.batchUpsertCatalogObjects(body);
      return result;
  } catch(error){
      console.error("Unexpected error in uploadProductsToSquare occurred: ", error)
      throw error;
  }
}


export const downloadImageAsBlob = async (imageUrl: string) => {
  try {
    const response = await axios.get(imageUrl, { responseType: 'stream' });
    return response.data;
  } catch (error) {
    console.error(`Failed to download image: ${error}`);
    throw error;  // or handle the error in another way
  }
}


export const uploadImageToSquare = async (objectId: string, imageUrl: string) => {
  try {
    const fileBlob = await downloadImageAsBlob(imageUrl);
    const catalogApi = initializeSquareClient(process.env.SQUARE_ACCESS_TOKEN!);
    const file = new FileWrapper(fileBlob);
      const response = await catalogApi.createCatalogImage({
          idempotencyKey: createUniqueUUID(),
          objectId,
          image: {
            type: 'IMAGE',
            id: '#IMAGE_ONE',
            itemData: {},
            imageData: {
              name: '',
              caption: ''
            }
          },
          isPrimary: true
        },
        file);


        return response;

  } catch (error) {
      console.log("____ERROR____", error);
      throw error;
  }
}


function normalizeItemsAndVariants(items: any[]) {
  const normalizedItems: NormalizedItems = {};
  const normalizedVariants: NormalizedVariants = {};

  items.forEach((item) => {
    if (item.type === 'ITEM') {
      normalizedItems[item.id] = { 
        ...item,
        ...item.itemData,
      };

      // Normalize variants
      item.itemData.variations.forEach((variant: any) => {
        normalizedVariants[variant.id] = {
          itemId: variant.itemVariationData.itemId,
          name: variant.itemVariationData.name,
        };
      });
    }
  });

  return { normalizedItems, normalizedVariants };
}


export const normalizeName = (name: string) => name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/gi, '');
  

export const updatedMatchImagesToItems = (items: any[], images: ImageMatchObj[]) => {
  const { normalizedItems, normalizedVariants } = normalizeItemsAndVariants(items);

  const matchedResults: MatchedResult[] = [];
  const unmatchedItems: UnmatchedItem[] = [];

  images.forEach((image) => {
    const normalizedImageName = normalizeName(image.fileName.replace(/\.[^/.]+$/, ""));
    let matched = false;

    // Check against parent items
    for (const [itemId, item] of Object.entries(normalizedItems)) {
      if (normalizedImageName.includes(normalizeName(item.name))) {

        matchedResults.push({
          itemId,
          variationId: null,
          fileName: image.fileName,
          name: item.name,

        });
        matched = true;
        break;
      }
    }

    // Check against variants if not already matched
    if (!matched) {
      for (const [variantId, variant] of Object.entries(normalizedVariants)) {
        if (normalizedImageName.includes(normalizeName(variant.name))) {
          console.log("Matched VARIATION", variant)
          matchedResults.push({
            itemId: variant.itemId,
            variationId: variantId,
            fileName: image.fileName,
            name: variant.name,

          });
          matched = true;
          break;
        }
      }
    }

    // If no match is found, consider the image unmatched
    if (!matched) {
      unmatchedItems.push({
        fileName: image.fileName,
        unmatchedType: 'image',
      });
    }
  });

  // Identify unmatched items and variants
  Object.entries(normalizedItems).forEach(([itemId, item]) => {
    const itemMatched = matchedResults.some((result) => result.itemId === itemId && !result.variationId);
    if (!itemMatched) {
      unmatchedItems.push({
        itemId,
        itemName: item.name,
        unmatchedType: 'item',
      });
    }
  });

  Object.entries(normalizedVariants).forEach(([variantId, variant]) => {
    const variantMatched = matchedResults.some((result) => result.variationId === variantId);
    if (!variantMatched) {
      unmatchedItems.push({
        itemId: variant.itemId,
        itemName: normalizedItems[variant.itemId].name,
        variationId: variantId,
        variationName: variant.name,
        unmatchedType: 'variation',
      });
    }
  });

  return { matchedResults, unmatchedItems };
};
