import PyPDF2

with open(r'C:\Users\abhis\Downloads\Abhimanyu_Sharma_CV_.pdf', 'rb') as file:
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"

with open('resume_text.txt', 'w', encoding='utf-8') as out:
    out.write(text)

print("Extraction successful.")
