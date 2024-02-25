require('dotenv').config();
const express = require('express');
const app = express();
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// Variable para almacenar el indicador del usuario
let userPrompt;

// Variable para almacenar la respuesta de la IA
let response;

const MODEL_NAME = "gemini-pro";

 
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
// Función para completar el texto
async function completarTexto(texto) {
    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      };
    
      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ];
    
  
     
  
      const parts = [
        {text: "You are a Prompt Engineer named Jarvis, a professional who specializes in designing and refining the questions or instructions, also known as “prompts,” that are provided to AI language models. It describes user prompts in more detail so that artificial intelligence can give them a better response, whether for text or a drawing. Prompts must be a maximum of 480 characters, always direct the prompt to an artificial intelligence such as Dall-E, midjourney, stable diffusion."},
        {text: "input:Indication Create a prompt to draw a Japanese Cyborn ninja"},
        {text: "output:Prompt Japanese Ninja Hanzou, cyborg, robot, front view, Japanese art relics, fighting pose, black mechanic ornate body, futuristic robe, ornate long skirt armour, perfect propotion, full body, black light, standing in the ancient Roma city, rainy sky, inner body glowing ,vecter art, highly detail, 3D rendering, cinematic scene, daylight"},
        {text: "input:Indication Create a prompt to draw a beautiful robotic woman"},
        {text: "output:Prompt Character Sheet, complex 3d render ultra detailed of a beautiful porcelain profile japan woman android face, cyborg, robotic parts, beautiful studio soft light, rim light, vibrant details, luxurious cyberpunk, lace, hyper realistic, anatomical, facial muscles, cable electric wires, microchip, elegant, beautiful background, octane render, H.R. Giger style"},
        {text: "input:Indication design of a Halloween pumpkin for a t-shirt"},
        {text: "output:Prompt a striking and original T-shirt design that captures the essence of adventure and discovery. Incorporate a vibrant Halloween pumpkin. The design should evoke a feeling of horror and inspire a sense of curiosity about the world. Use a rich color palette that includes deep blues, purples, and soft greens to create a dreamlike atmosphere. Ensure the details are crisp and the composition is visually engaging."},
        {text: "input:Indication Create a prompt to draw  a woman in armor"},
        {text: "output:Prompt create a High sci-fi, Beautiful, iridescent, fluid, bright metallic colors of white and blue, 8k hyper detailed, highly intricate of a muscular but very curvy afrocentric woman with short dreadlocks, wearing stylized close-fitting mech armor that is extending into metal wings, while she begins to fly, wearing metallic white mecha heels, 5th dimensional"},
        {text: "input:Indication Create a prompt to draw a cyborg Xenomorph"},
        {text: "output:Prompt A cyborg Xenomorph, a creature with characteristics of both a machine and an extraterrestrial, takes center stage in this stunning image. Accompanied by majestic orcas leaping out of the sea, the scene presents a captivating side view. This expertly-crafted artwork showcases the cyborg Xenomorph in fine detail, highlighting its metallic components seamlessly integrated with its organic features. The orcas, portrayed with dynamic motion and grace, heighten the visual spectacle. The high-resolution image captures every intricate detail and vibrant color, immersing viewers in a mesmerizing blend of science fiction and marine beauty."},
        {text: "input:Indication Create a prompt to draw a mysteriously chilling extraterrestrial dragon egg"},
        {text: "output:Prompt A mysteriously chilling extraterrestrial dragon egg, brimming with paranormal energy, is frozen in time within the image. The dragon egg appears to be a shimmering metallic orb, emitting an ethereal glow against the dark background. The image, a digitally enhanced photograph, captures every intricate detail of the artifact's jagged engravings and smooth, otherworldly surface. The colors are vivid and intense, with a mesmerizing mix of iridescent greens and enigmatic blues. The dragon egg seems to hold a supernatural power, as if it possesses a secret knowledge that could unravel the fabric of reality itself."},
        {text: "input:Indication Create a prompt to draw a ghostly jellyfish"},
        {text: "output:Prompt photo RAW, Black and pink : Portrait of a ghostly jellyfish, shiny aura, highly detailed, gold filigree, intricate motifs, organic tracery, by Android jones, Januz Miralles, Hikari Shimoda, glowing stardust by W. Zelmer, perfect composition, smooth, sharp focus, sparkling particles, lively coral reef background Realistic, realism, hd, 35mm photograph, 8k, masterpiece, award winning photography, natural light, perfect composition, high detail, hyper realistic"},
        {text: "input:Indication Create a prompt to draw a modern building"},
        {text: "output:Prompt Symtrical,Night, Aerial View, top view, bird view, stunning architecture, clean scenary,symetrical octopus Form, beautiful form,arafed view of a modern tree building,bjarke ingel, Vincent Callebaut, parametric architecture,on desert city,night, beautiful cityscape view,inspired by Zha Shibiao, in style of zaha hadid architect, zaha hadid style architecture, , high quality architectural art, futuristic architectural art, by Zha Shibiao, , futuristic architecture, zaha hadid architecture"},
        {text: "input:Indication Create a prompt to draw a galaxies inside an apple made of crystal"},
        {text: "output:Prompt high quality, 8K Ultra HD, Space stars and galaxies inside an apple made of crystal, by yukisakura, high detailed, Beautiful, epic, vibrant colors, surface detail, surreal lighting, 4K, 8K, 64K, photography realistic, hype realistic, detailed, highly detailed, high resolution, hyper-detailed, HDR, UHD, Surrealism, Vibrant, Ultra-smooth, Rich and vibrant colors, Unique features, Expressive emotions, Dynamic pose, Textured surfaces, High contrast, Shallow depth of field, striking colors, rendering"},
        {text: "input:Indication Create a prompt to draw a majestic Swedish viking"},
        {text: "output:Prompt A majestic Swedish viking standing proudly, adorned with the powerful vegviser symbol. This captivating image, possibly a detailed painting, showcases the viking's strong and commanding presence, exuding a sense of bravery and adventure. His weathered and battle-worn armor glistens in the light, portraying a rich history and tales of conquest. The intricate details in his braided beard and fierce gaze reflect the artist's meticulous skill. With vibrant colors and impeccable precision, this awe-inspiring image beautifully captures the essence of Swedish Viking heritage, captivating viewers with its exceptional quality and attention to detail."},
        {text: "input:Indication Create a prompt to draw a young beautiful woman"},
        {text: "output:Prompt high quality, 8K Ultra HD, high detailed, Steampunk Time Voyager, Watercolor, wash technique, colorful, blurry, smudge outline, like a fairy tale, The protagonist, a courageous young beautiful woman adorned in a blend of vintage and futuristic attire, Embark on a thrilling journey through time in a steampunk-infused world, where past and future intertwine in perfect unison, This intricate digital art piece captures the essence of a daring time voyager exploring a Victorian-era metropolis with a steampunk twist, stands atop a colossal clock tower adorned with ornate cogs and gears, propelled by precise mechanical propellers, The city's architecture harmoniously blends classic Victorian elegance with intricate steampunk machinery, resulting in a visually captivating juxtaposition, by yukisakura, awesome full color,"},
        {text: "input:Indication Create a prompt to draw a Isometric Island  Fantasy"},
        {text: "output:Prompt 3d vray render, isometric, zoomed out, Acid Island, poison, Scary, black background , small Island, island isn’t out of the picture, acid pool, Island is shaped like a skull"},
        {text: "input:Indication Create a prompt to draw a Isometric  future Mars colony Scifi Buildings"},
        {text: "output:Prompt 3d vray render,Isometric future Mars colony, Scifi"},
        {text: "input:Indication Create a prompt to draw a surrealist scene"},
        {text: "output:Prompt Create a surrealist scene with a pensive-looking character sitting inside a watermelon eating watermelon."},
        {text: "input:Indication Create a prompt to a drawing in the style of Vincent van Gogh's"},
        {text: "output:Prompt high quality, highly detailed, Imagine a dreamlike scene blending the swirling cosmic colors of Vincent van Gogh's Starry Night with the surreal celestial precision of Salvador Dalí. In this cosmic dance, celestial bodies echo Turner's atmospheric touch, blurring the line between reality and fantasy, In the foreground, a fantastical creature takes center stage, blending the whimsy of Hieronymus Bosch's beings with the organic flow of Alphonse Mucha's art nouveau lines. Elements of H.R. Giger's biomechanical aesthetic add an otherworldly touch, by yukisakura, awesome full color,"},
        {text: "input:Indication create a prompt to draw a cubism movement"},
        {text: "output:Prompt A cubism movement artwork illustrating the essence of harmony, chaos, and fluidity. Geometric shapes, vibrant colors, and intricate patterns blend seamlessly, creating a dynamic composition. The artwork captures the fragmented and multifaceted nature of existence, inviting viewers to explore the depths of abstraction and the interplay of contrasting elements."},
        {text: "input:Indication Create a message to draw a Naturalistic movement."},
        {text: "output:Prompt Journey into the heart of naturalism, where art mirrors the beauty and intricacies of the natural world. Depict a serene landscape where lush greenery meets tranquil waters, capturing the essence of harmony and balance. Let the colors dance upon the canvas, evoking emotions and inviting viewers to immerse themselves in the splendor of nature's embrace."},
        {text: "input:Indication create a message to draw an abstract"},
        {text: "output:Prompt Unleash the power of abstraction, where colors and forms dance in harmonious chaos. Create an artwork that transcends the boundaries of reality, where emotions and sensations collide. Let vibrant hues blend and shapes intertwine, evoking a sense of mystery and intrigue. Explore the depths of the imagination and invite viewers to embark on a journey of self-discovery through the lens of abstract expression."},
        {text: "input:Indication create vector art with a joker based on the Dark Knights movie"},
        {text: "output:Prompt create art for a mug with a joker based on the film Dark Knights, with phrases,graphic design a mug, flat design,gotham street, colorful tones, highly detailed clean, vector image, professional photography, smoke explosion, simple background, flat black background , shiny vector ((black background)) color scheme: blue and black, expression: mysterious and haunting, size and shape of great sword: massive and double-edged, environment: fiery and chaotic, camera specs/model name: high-resolution DSLR, perspective: slightly low angle to emphasize the warrior's power, lighting: dramatic, with a spotlight illuminating the warrior's face and sword, depth of field: shallow, with the warrior in sharp focus and the fiery background slightly blurred, shutter speed: fast to capture the warrior's dynamic movement, photo quality: crisp and detailed, capturing the intricate details of the warrior's a"},
        {text: "input:Indication draw a cartoon of a worm fishing in a boat"},
        {text: "output:Prompt Create a cute and humorous cartoon of a worm fishing in a tiny boat on a calm pond. The worm, wearing a cheerful hat and holding a fishing rod, sits comfortably as the sun shines brightly, casting a golden glow over the peaceful scene."},
        {text: "input:Indication an illustration of a balloon playing with a needle"},
        {text: "output:Prompt Create a cute illustration of a balloon playing with a needle. The balloon should be depicted as a happy, playful character, while the needle should be portrayed as a mischievous troublemaker. The overall tone of the illustration should be lighthearted and whimsical."},
        {text: "input:Indication design a translucent crystal red rose on a black background"},
        {text: "output:Prompt Create a detailed, photorealistic image of a red rose made of translucent glass on a black background. Render the glass with a high level of detail, showing its transparency and refractions. The rose should be fully bloomed, with intricate petals and a delicate stem. Place the rose against a solid black background to make it the focal point of the image"},
        {text: texto},
        {text: "output:Prompt"},
              ];
  // Obtiene la respuesta de la IA
  response = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  return response;
}

// Ruta para la página principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Ruta para recibir el indicador del usuario
app.post('/completar-texto', async (req, res) => {
  // Obtiene el indicador del usuario del cliente
  userPrompt = req.body.texto;

  // Llama a la función para completar el texto
  const respuesta = await completarTexto(userPrompt);
  console.log(respuesta.response.candidates[0].content);


  let mensajes = [];
  // Agrega el mensaje de respuesta del bot al arreglo
  mensajes.push({role: "Prompt", content: respuesta.response.candidates[0].content.parts[0].text});
  
  // Envía todos los mensajes al cliente
  res.json({ mensajes });
});

// Inicia el servidor en el puerto 3000
app.listen(3001, () => {
  console.log('Servidor iniciado en el puerto 3001');
});





 
