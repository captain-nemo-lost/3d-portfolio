import fs from 'fs';

async function run() {
    const pdfParse = (await import('pdf-parse')).default;
    const dataBuffer = fs.readFileSync('C:\\Users\\abhis\\Downloads\\Abhimanyu_Sharma_CV_.pdf');
    const data = await pdfParse(dataBuffer);
    fs.writeFileSync('resume_text.txt', data.text);
    console.log('PDF extracted successfully to resume_text.txt');
}
run().catch(console.error);
