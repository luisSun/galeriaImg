import cv2
import numpy as np
import os
import sys
from datetime import datetime, timedelta

def delete_old_images():
    try:
        folder_path = r"F:\Documentos\Cursos\#2024 - Cursos\JS\SITE PROJETO\galerias\imgs\temp"
        now = datetime.now()
        limit_time = now - timedelta(minutes=5)

        # Percorre as imagens na pasta e deleta as que são mais antigas que o limite de tempo
        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)
            mod_time = datetime.fromtimestamp(os.path.getmtime(file_path))
            if mod_time < limit_time:
                os.remove(file_path)
    except Exception as e:
        print("Erro ao deletar imagens antigas:", e)

FOLDER_PATH = r"F:\Documentos\Cursos\#2024 - Cursos\JS\SITE PROJETO\galerias\imgs"

def resize_to_same_size(image1, image2):
    # Redimensiona a imagem1 para ter o mesmo tamanho da imagem2
    width = min(image1.shape[1], image2.shape[1])
    height = min(image1.shape[0], image2.shape[0])
    resized_image1 = cv2.resize(image1, (width, height))
    resized_image2 = cv2.resize(image2, (width, height))
    return resized_image1, resized_image2

def compare_to_folder_image(image_path):
    delete_old_images()
    try:
        # Carrega a imagem a ser comparada
        image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

        if image is None:
            print("Erro ao carregar a imagem.")
            return

        similar_images = []

        for filename in os.listdir(FOLDER_PATH):
            # Verifica se o arquivo é uma imagem
            if any(filename.lower().endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.bmp', '.tif', '.tiff', '.webp', '*']):
                # Carrega a imagem da pasta
                folder_image_path = os.path.join(FOLDER_PATH, filename)
                folder_image = cv2.imread(folder_image_path, cv2.IMREAD_GRAYSCALE)

                if folder_image is None:
                    print(f"Erro ao carregar a imagem {filename}.")
                    continue

                # Redimensiona as imagens para terem o mesmo tamanho
                image_resized, folder_image_resized = resize_to_same_size(image, folder_image)

                # Calcula a diferença absoluta entre os pixels das imagens
                difference = cv2.absdiff(image_resized, folder_image_resized)
                mean_difference = np.mean(difference)

                # Define os limiares para considerar as imagens como "identicas", "parecidas" ou "diferentes"
                identical_threshold = 1.0
                similar_threshold = 52.3

                if mean_difference < identical_threshold or mean_difference < similar_threshold:
                    similar_images.append((filename, mean_difference))

        for filename, mean_difference in similar_images:
            if mean_difference < identical_threshold:
                print(f"{filename} igual")
            elif mean_difference < similar_threshold:
                print(f"{filename} parecida")
    except Exception as e:
        print("Erro ao carregar ou processar as imagens:", e)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Uso: python script.py caminho_da_imagem")
        sys.exit(1)
    image_path = sys.argv[1]
    compare_to_folder_image(image_path)