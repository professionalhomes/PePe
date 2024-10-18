const fs = require('fs');
const path = require('path');

// Read the file content
const fileContent = fs.readFileSync('dataset.txt', 'utf8');

// Split the content into lines
const lines = fileContent.split('\n');

// Remove the header line
lines.shift();

// Function to create a slug for file names
const createSlug = (str) => {
  return str.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
};

// Process each line
lines.forEach(line => {
  const [name, rarity, ability, power, coin, image] = line.split('\t');
  
  // Create the JSON object in the specified format
  const cardJson = {
    name: name.trim(),
    description: ability.trim(),
    image: `ipfs://${image.trim()}`,  // Replace with the IPFS CID after uploading
    attributes: [
      {
        trait_type: "Rarity",
        value: rarity.trim()
      },
      {
        trait_type: "Power",
        value: parseInt(power.trim(), 10)
      },
      {
        trait_type: "Ability",
        value: ability.trim()
      }
    ]
  };
  
  // Create a file name based on the card name
  const fileName = createSlug(cardJson.name) + '.json';

  // Save the JSON object to a file
  fs.writeFileSync(path.join('cards', fileName), JSON.stringify(cardJson, null, 2));

  console.log(`Created: ${fileName}`);
});

console.log('All cards processed.');
