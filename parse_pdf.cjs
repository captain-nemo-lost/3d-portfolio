const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('C:\\Users\\abhis\\Downloads\\Abhimanyu_Sharma_CV_.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('resume_text.txt', data.text);
    console.log('PDF extracted successfully to resume_text.txt');
}).catch(err => {
    console.error('Error extracting PDF:', err);
});
