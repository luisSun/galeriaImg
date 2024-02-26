import cv2
import numpy as np
import os

def resize_to_same_size(image1, image2):
    # Redimensiona a imagem1 para ter o mesmo tamanho da imagem2
    width = min(image1.shape[1], image2.shape[1])
    height = min(image1.shape[0], image2.shape[0])
    resized_image1 = cv2.resize(image1, (width, height))
    resized_image2 = cv2.resize(image2, (width, height))
    return resized_image1, resized_image2

def compare_to_folder_image(image_path, folder_path):
    try:
        # Carrega a imagem a ser comparada
        image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

        if image is None:
            print("Erro ao carregar a imagem.")
            return

        for filename in os.listdir(folder_path):
            # Verifica se o arquivo é uma imagem
            if any(filename.lower().endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.bmp', '.tif', '.tiff']):
                # Carrega a imagem da pasta
                folder_image_path = os.path.join(folder_path, filename)
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

                if mean_difference < identical_threshold:
                    print(f"A imagem {filename} é idêntica.")
                elif mean_difference < similar_threshold:
                    print(f"A imagem {filename} é parecida.")
                else:
                    print(f"A imagem {filename} é diferente.")
    except Exception as e:
        print("Erro ao carregar ou processar as imagens:", e)

if __name__ == "__main__":
    image_path = "imagem2.jpg"
    folder_path = r"F:\Imagens\Imagens e Docs"
    compare_to_folder_image(image_path, folder_path)
