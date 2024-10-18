const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Define the directory to store metadata files
const outputDir = path.join(__dirname, 'metadata');

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Function to format card data into JSON structure
function formatCardToJSON(cardData) {
  console.log('Card Data:', cardData); // Debug: Print card data

  // Adjust the image filename to start from 0.webp
  const imageIndex = parseInt(cardData.Image, 10) - 1; // Subtract 1 from the image index
  const imageName = `${imageIndex}.webp`; // Construct the image filename

  return {
    name: cardData.Name,  // Matches the 'Name' column
    description: `This is the ${cardData.Name} card with special ability: ${cardData.Ability}`,
    image: `ipfs://bafybeibi2k6ufhwllq7m4z4lug47hr45omvi3n5fe52nvfri3v3n6nlfka/${imageName}`,  // Use the adjusted image filename
    attributes: [
      {
        trait_type: 'Rarity',
        value: cardData.Rarity,  // Matches the 'Rarity' column
      },
      {
        trait_type: 'Power',
        value: parseInt(cardData.Power, 10),  // Matches the 'Power' column
      },
      {
        trait_type: 'Defense',
        value: parseInt(cardData.Defense, 10),  // Matches the 'Defense' column
      },
      {
        trait_type: 'Ability',
        value: cardData.Ability,  // Matches the 'Ability' column
      },
    ],
  };
}

// Read CSV and generate JSON files
let index = 0;

fs.createReadStream('dataset_new.csv')
  .pipe(csv({ separator: '\t' }))  // Specify the tab delimiter here
  .on('data', (row) => {
    console.log(`Processing row ${index}:`, row); // Debug: Print each row
    const jsonData = formatCardToJSON(row);
    const fileName = `${index}`;  // File name without extension
    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    console.log(`Generated JSON file: ${filePath}`);
    index++;  // Increment the index for the next file
  })
  .on('end', () => {
    console.log('All JSON metadata files have been generated.');
  })
  .on('error', (error) => {
    console.error('Error reading CSV file:', error);
  });
