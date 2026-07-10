from pdf2image import convert_from_path
import pytesseract
import cv2
import numpy as np
from pytesseract import Output


class OCRService:

    def __init__(self):
        import platform
        if platform.system() == 'Windows':
            self.poppler_path = r"C:\Release-26.02.0-0\poppler-26.02.0\Library\bin"
            self.tesseract_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
            pytesseract.pytesseract.tesseract_cmd = self.tesseract_path
        else:
            self.poppler_path = None
            self.tesseract_path = None

    def preprocess_image(self, image):

        image = np.array(image)

        gray = cv2.cvtColor(
            image,
            cv2.COLOR_RGB2GRAY
        )

        gray = cv2.GaussianBlur(
            gray,
            (3, 3),
            0
        )

        gray = cv2.threshold(
            gray,
            0,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )[1]

        return gray

    def calculate_confidence(self, image):

        data = pytesseract.image_to_data(
            image,
            output_type=Output.DICT
        )

        confidences = []

        for confidence in data["conf"]:

            try:

                confidence = float(confidence)

                if confidence > 0:

                    confidences.append(confidence)

            except:

                pass

        if len(confidences) == 0:

            return 0

        return sum(confidences) / len(confidences)

    def extract_text(self, pdf_path):

        if self.poppler_path:
            pages = convert_from_path(
                pdf_path,
                dpi=300,
                poppler_path=self.poppler_path
            )
        else:
            pages = convert_from_path(
                pdf_path,
                dpi=300
            )


        text = ""

        page_confidences = []

        for page in pages:

            processed = self.preprocess_image(page)

            confidence = self.calculate_confidence(processed)

            page_confidences.append(confidence)

            print(f"OCR Confidence: {confidence:.2f}%")

            if confidence < 60:

                print(
                    "Warning: Low OCR confidence. The extracted text may be inaccurate."
                )

            page_text = pytesseract.image_to_string(
                processed,
                lang="eng"
            )

            text += page_text + "\n"

        average_confidence = 0

        if page_confidences:

            average_confidence = round(

                sum(page_confidences) /

                len(page_confidences),

                2

            )

        return {

            "text": text,

            "ocr_used": True,

            "ocr_confidence": average_confidence,

            "processing_status": "Completed"

        }