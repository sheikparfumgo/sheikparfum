import axios from "axios";
import fs from "fs";
import path from "path";
import { generateSlug } from "@/lib/utils/slug";

export async function downloadPerfumeImages(
    name: string,
    imageUrls: string[]
) {
    const slug = generateSlug(name);

    const folderPath = path.join(
        process.cwd(),
        "public",
        "images",
        "perfumes",
        slug
    );

    // 📁 cria pasta se não existir
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const savedPaths: string[] = [];

    for (let i = 0; i < imageUrls.length; i++) {
        const url = imageUrls[i];

        if (!url) continue;

        const response = await axios.get(url, {
            responseType: "arraybuffer",
        });

        const contentType = response.headers["content-type"];

        let extension = "jpg";

        if (contentType?.includes("png")) extension = "png";
        if (contentType?.includes("webp")) extension = "webp";

        const fileName =
            i === 0
                ? `main.${extension}`
                : i === 1
                    ? `bottle.${extension}`
                    : `lifestyle.${extension}`;

        const filePath = path.join(folderPath, fileName);

        fs.writeFileSync(filePath, response.data);

        savedPaths.push(
            `/images/perfumes/${slug}/${fileName}`
        );
    }

    return {
        image_main: savedPaths[0],
        images: savedPaths,
    };
}