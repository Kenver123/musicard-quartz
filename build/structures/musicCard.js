const canvas = require("@napi-rs/canvas");
const { colorFetch } = require("../functions/colorFetch");

 //canvas.GlobalFonts.registerFromPath(`build/structures/font/circularstd-black.otf`, "circular-std");
 //canvas.GlobalFonts.registerFromPath(`build/structures/font/notosans-jp-black.ttf`, "noto-sans-jp");
 //canvas.GlobalFonts.registerFromPath(`build/structures/font/notosans-black.ttf`, "noto-sans");
 //canvas.GlobalFonts.registerFromPath(`build/structures/font/notoemoji-bold.ttf`, "noto-emoji");
 //canvas.GlobalFonts.registerFromPath(`build/structures/font/notosans-kr-black.ttf`, "noto-sans-kr");
 //canvas.GlobalFonts.registerFromPath(`build/structures/font/Space.ttf`, "space");


canvas.GlobalFonts.registerFromPath(`node_modules/musicard-quartz/build/structures/font/circularstd-black.otf`, "circular-std");
canvas.GlobalFonts.registerFromPath(`node_modules/musicard-quartz/build/structures/font/notosans-jp-black.ttf`, "noto-sans-jp");
canvas.GlobalFonts.registerFromPath(`node_modules/musicard-quartz/build/structures/font/notosans-black.ttf`, "noto-sans");
canvas.GlobalFonts.registerFromPath(`node_modules/musicard-quartz/build/structures/font/notoemoji-bold.ttf`, "noto-emoji");
canvas.GlobalFonts.registerFromPath(`node_modules/musicard-quartz/build/structures/font/notosans-kr-black.ttf`, "noto-sans-kr");
canvas.GlobalFonts.registerFromPath(`node_modules/musicard-quartz/build/structures/font/Chewy-Regular.ttf`, "chewy");
canvas.GlobalFonts.registerFromPath(`node_modules/musicard-quartz/build/structures/font/Space.ttf`, "space");


class musicCard {
    constructor(options) {
        this.name = options?.name ?? null;
        this.author = options?.author ?? null;
        this.color = options?.color ?? null;
        this.theme = options?.theme ?? null;
        this.brightness = options?.brightness ?? null;
        this.thumbnail = options?.thumbnail ?? null;
        this.progress = options?.progress ?? null;
        this.starttime = options?.startTime ?? null;
        this.endtime = options?.endTime ?? null;
        this.image = options?.image ?? null;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setAuthor(author) {
        this.author = author;
        return this;
    }

    setColor(color) {
        this.color = color;
        return this;
    }

    setTheme(theme) {
        this.theme = theme || 'quartz+';
        return this;
    }

    setBrightness(brightness) {
        this.brightness = brightness;
        return this;
    }

    setThumbnail(thumbnail) {
        this.thumbnail = thumbnail;
        return this;
    }

    setImage(image) {
        this.image = image
        return this;
    }

    setProgress(progress) {
        this.progress = progress;
        return this;
    }

    setStartTime(starttime) {
        this.starttime = starttime;
        return this;
    }

    setEndTime(endtime) {
        this.endtime = endtime;
        return this;
    }

    async build() {
        if (!this.name) throw new Error('Missing name parameter');
        if (!this.author) throw new Error('Missing author parameter');
        if (!this.color) this.setColor('ff0000');
        if (!this.theme) this.setTheme('quartz+');
        if (!this.brightness) this.setBrightness(0);
        if (!this.thumbnail) this.setThumbnail('https://s6.imgcdn.dev/Opo4a.jpg');
        if (!this.progress) this.setProgress(0);
        if (!this.starttime) this.setStartTime('0:00');
        if (!this.endtime) this.setEndTime('0:00');

        let validatedProgress = parseFloat(this.progress);
        if (Number.isNaN(validatedProgress) || validatedProgress < 0 || validatedProgress > 100) throw new Error('Invalid progress parameter, must be between 0 to 100');

        if (validatedProgress < 2) validatedProgress = 2;
        if (validatedProgress > 99) validatedProgress = 99;

        const validatedStartTime = this.starttime || '0:00';
        const validatedEndTime = this.endtime || '0:00';

        const validatedColor = await colorFetch(
            this.color || '270ef5',
            parseInt(this.brightness) || 0,
            this.thumbnail
        );

        if (this.name.length > 15) this.name = `${this.name.slice(0, 13)}...`;
        if (this.author.length > 15) this.author = `${this.author.slice(0, 13)}...`;

        if (this.theme === "quartz+") {

            const progressBarWidth = (validatedProgress / 100) * 670;
            const circleX = progressBarWidth + 60;
            const image = canvas.createCanvas(1280, 450);
            const ctx = image.getContext('2d');
            const progressBarCanvas = canvas.createCanvas(670, 25);
            const progressBarCtx = progressBarCanvas.getContext('2d');
            const cornerRadius = 10;
            progressBarCtx.beginPath();
            progressBarCtx.moveTo(cornerRadius, 0);
            progressBarCtx.lineTo(670 - cornerRadius, 0);
            progressBarCtx.arc(670 - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
            progressBarCtx.lineTo(670, 25 - cornerRadius);
            progressBarCtx.arc(670 - cornerRadius, 25 - cornerRadius, cornerRadius, 0, 0.5 * Math.PI);
            progressBarCtx.lineTo(cornerRadius, 25);
            progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
            progressBarCtx.lineTo(0, cornerRadius);
            progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
            progressBarCtx.closePath();
            progressBarCtx.fillStyle = '#ababab';
            progressBarCtx.fill();
            progressBarCtx.beginPath();
            progressBarCtx.moveTo(cornerRadius, 0);
            progressBarCtx.lineTo(progressBarWidth - cornerRadius, 0);
            progressBarCtx.arc(progressBarWidth - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
            progressBarCtx.lineTo(progressBarWidth, 25);
            progressBarCtx.lineTo(cornerRadius, 25);
            progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
            progressBarCtx.lineTo(0, cornerRadius);
            progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
            progressBarCtx.closePath();
            progressBarCtx.fillStyle = `#${validatedColor}`;
            progressBarCtx.fill();

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            circleCtx.beginPath();
            circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
            circleCtx.fillStyle = `#${validatedColor}`;
            circleCtx.fill();

            const background = await canvas.loadImage(this.image, {
                
                requestOptions: {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                    }
                }
            });

            const thumbnailCanvas = canvas.createCanvas(564, 564);
            const thumbnailCtx = thumbnailCanvas.getContext('2d');

            let thumbnailImage;

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
            
                throw new Error(`Failed to load Thumnail Image\n The Image URl is invalid or the image is not accessible\n${error}`);
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

            const cornerRadius2 = 45;

            thumbnailCtx.beginPath();
            thumbnailCtx.moveTo(0 + cornerRadius2, 0);
            thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
            thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
            thumbnailCtx.closePath();
            thumbnailCtx.clip();

            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);








            const bg2 = await canvas.loadImage("https://i.ibb.co/dP4ZCXM/ASY5GPH.png")

            ctx.drawImage(background, 0, 0, 1280, 450);
            ctx.drawImage(bg2, 0, 0, 1280, 450);

            const gradient = ctx.createLinearGradient(0, 0, 0, 450);
            gradient.addColorStop(0, 'rgba(0,0,0,0.1)'); 
            gradient.addColorStop(0.5, 'rgba(0,0,0,0.1)'); 
            gradient.addColorStop(1, 'rgba(0,0,0,0.1)'); 

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1280, 450);
            ctx.fillStyle = `#${validatedColor}`;
            ctx.font = `90px space,  noto-emoji,`;
            ctx.fillText(this.name, 450, 200); 

            ctx.fillStyle = '#b8b8b8';
            ctx.font = `40px space, noto-emoji`;
            ctx.fillText(this.author, 460, 260); 

            ctx.fillStyle = '#fff';
            ctx.font = '30px space';
            ctx.fillText(validatedStartTime, 450, 380); 

            ctx.fillStyle = '#fff';
            ctx.font = '30px space';
            ctx.fillText(validatedEndTime, 1050, 380);
            ctx.save();

            const thumbnailMaskCanvas = canvas.createCanvas(thumbnailCanvas.width, thumbnailCanvas.height);
            const thumbnailMaskCtx = thumbnailMaskCanvas.getContext('2d');
            const thumbnailMaskRadius = thumbnailCanvas.width / 2;
            
            thumbnailMaskCtx.beginPath();
            thumbnailMaskCtx.arc(thumbnailMaskRadius, thumbnailMaskRadius, thumbnailMaskRadius, 0, 2 * Math.PI);
            thumbnailMaskCtx.closePath();
            thumbnailMaskCtx.fillStyle = '#000'; 
            thumbnailMaskCtx.fill();
            
      


            
            
            ctx.drawImage(thumbnailCanvas, 57, 105, 288, 288);
            ctx.drawImage(progressBarCanvas, 450, 310, 670, 25); 
            ctx.drawImage(circleCanvas, 400, 225, 1000, 1000);
            


            return image.toBuffer('image/png');


        } if (this.theme == 'onepiece+') {
            const progressBarWidth = (validatedProgress / 100) * 670;
            const circleX = progressBarWidth + 60;

            const progressBarCanvas = canvas.createCanvas(670, 25);
            const progressBarCtx = progressBarCanvas.getContext('2d');
            const cornerRadius = 10;
            progressBarCtx.beginPath();
            progressBarCtx.moveTo(cornerRadius, 0);
            progressBarCtx.lineTo(670 - cornerRadius, 0);
            progressBarCtx.arc(670 - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
            progressBarCtx.lineTo(670, 25 - cornerRadius);
            progressBarCtx.arc(670 - cornerRadius, 25 - cornerRadius, cornerRadius, 0, 0.5 * Math.PI);
            progressBarCtx.lineTo(cornerRadius, 25);
            progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
            progressBarCtx.lineTo(0, cornerRadius);
            progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
            progressBarCtx.closePath();
            progressBarCtx.fillStyle = '#ababab';
            progressBarCtx.fill();
            progressBarCtx.beginPath();
            progressBarCtx.moveTo(cornerRadius, 0);
            progressBarCtx.lineTo(progressBarWidth - cornerRadius, 0);
            progressBarCtx.arc(progressBarWidth - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
            progressBarCtx.lineTo(progressBarWidth, 25);
            progressBarCtx.lineTo(cornerRadius, 25);
            progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
            progressBarCtx.lineTo(0, cornerRadius);
            progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
            progressBarCtx.closePath();
            progressBarCtx.fillStyle = `#${validatedColor}`;
            progressBarCtx.fill();

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            circleCtx.beginPath();
            circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
            circleCtx.fillStyle = `#ff0000`;
            circleCtx.fill();

            const background = await canvas.loadImage(`https://i.ibb.co/SXnnyMz/20241113-200145.png`);

            const thumbnailCanvas = canvas.createCanvas(564, 564);
            const thumbnailCtx = thumbnailCanvas.getContext('2d');

            let thumbnailImage;

           
            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
            
                throw new Error(`Failed to load Thumnail Image\n The Image URl is invalid or the image is not accessible\n${error}`);
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

            const cornerRadius2 = 45;

            thumbnailCtx.beginPath();
            thumbnailCtx.moveTo(0 + cornerRadius2, 0);
            thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
            thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
            thumbnailCtx.closePath();
            thumbnailCtx.clip();

            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

            const image = canvas.createCanvas(1280, 450);
            const ctx = image.getContext('2d');

            ctx.drawImage(background, 0, 0, 1280, 450);

            ctx.fillStyle = `#fff`;
            ctx.font = `50px circular-std`;
            ctx.fillText(this.name, 250, 120);

            ctx.fillStyle = '#fff';
            ctx.font = `25px circular-std`;
            ctx.fillText(this.author, 255, 180);

            ctx.fillStyle = '#fff';
            ctx.font = '30px circular-std';
            ctx.fillText(validatedStartTime, 70, 315);

            ctx.fillStyle = '#fff';
            ctx.font = '30px circular-std';
            ctx.fillText(validatedEndTime, 660, 315);

            ctx.drawImage(thumbnailCanvas, 45, 35, 180, 180);
            ctx.drawImage(progressBarCanvas, 70, 250, 670, 25);
            ctx.drawImage(circleCanvas, 10, 165, 1000, 1000);

            return image.toBuffer('image/png');
        }  else if (this.theme === "vector+") {

            const progressBarWidth = (validatedProgress / 100) * 670;
            const circleX = progressBarWidth + 60;

            const progressBarCanvas = canvas.createCanvas(670, 25);
            const progressBarCtx = progressBarCanvas.getContext('2d');
            const cornerRadius = 10;
            progressBarCtx.beginPath();
            progressBarCtx.moveTo(cornerRadius, 0);
            progressBarCtx.lineTo(670 - cornerRadius, 0);
            progressBarCtx.arc(670 - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
            progressBarCtx.lineTo(670, 25 - cornerRadius);
            progressBarCtx.arc(670 - cornerRadius, 25 - cornerRadius, cornerRadius, 0, 0.5 * Math.PI);
            progressBarCtx.lineTo(cornerRadius, 25);
            progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
            progressBarCtx.lineTo(0, cornerRadius);
            progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
            progressBarCtx.closePath();
            progressBarCtx.fillStyle = '#ababab';
            progressBarCtx.fill();
            progressBarCtx.beginPath();
            progressBarCtx.moveTo(cornerRadius, 0);
            progressBarCtx.lineTo(progressBarWidth - cornerRadius, 0);
            progressBarCtx.arc(progressBarWidth - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
            progressBarCtx.lineTo(progressBarWidth, 25);
            progressBarCtx.lineTo(cornerRadius, 25);
            progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
            progressBarCtx.lineTo(0, cornerRadius);
            progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
            progressBarCtx.closePath();
            progressBarCtx.fillStyle = `#${validatedColor}`;
            progressBarCtx.fill();

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            circleCtx.beginPath();
            circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
            circleCtx.fillStyle = `#${validatedColor}`;
            circleCtx.fill();

            const background = await canvas.loadImage(this.image, {

                requestOptions: {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                    }
                }

            });

            const thumbnailCanvas = canvas.createCanvas(650, 650);
            const thumbnailCtx = thumbnailCanvas.getContext('2d');


            let thumbnailImage;

           
            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
            
                throw new Error(`Failed to load Thumnail Image\n The Image URl is invalid or the image is not accessible\n${error}`);
            }
            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

            const cornerRadius2 = 45;

            thumbnailCtx.beginPath();
            thumbnailCtx.moveTo(0 + cornerRadius2, 0);
            thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
            thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
            thumbnailCtx.closePath();
            thumbnailCtx.clip();

            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

            const image = canvas.createCanvas(1280, 450);
            const ctx = image.getContext('2d');

            // Draw the background
            ctx.drawImage(background, 0, 0, 1280, 450);

            // Apply fade effect between background and upper parts
            const gradient = ctx.createLinearGradient(0, 0, 0, 450);
            gradient.addColorStop(0, 'rgba(0,0,0,0.7)'); // Fully transparent
            gradient.addColorStop(0.5, 'rgba(0,0,0,0.7)'); // 50% transparent
            gradient.addColorStop(1, 'rgba(0,0,0,0.7)'); // Fully opaque

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1280, 450);
            ctx.fillStyle = `#${validatedColor}`;
            ctx.font = `110px space`;
            ctx.fillText(this.name, 490, 200); 

            ctx.fillStyle = '#b8b8b8';
            ctx.font = `55px space`;
            ctx.fillText(this.author, 510, 260); 

            ctx.fillStyle = '#fff';
            ctx.font = '30px space';
            ctx.fillText(validatedStartTime, 510, 410); 

            ctx.fillStyle = '#fff';
            ctx.font = '30px space';
            ctx.fillText(validatedEndTime, 1100, 410);

           ctx.drawImage(thumbnailCanvas, 70, 50, 350, 350);
            ctx.drawImage(progressBarCanvas, 510, 340, 670, 25); 
            ctx.drawImage(circleCanvas, 445, 253, 1000, 1000);

            return image.toBuffer('image/png');


        } else {
            throw new Error('Invalid theme parameter, must be  one of "quartz+" "onepiece+" "vector+"');
        }
    }
}

module.exports = { musicCard }; 
