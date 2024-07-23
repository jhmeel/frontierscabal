import PDFDocument from "pdfkit";
import fs from "fs";
import cloudinary from "cloudinary";

const pdfGen = async (
  image,
  courseTitle,
  courseCode,
  level,
  session,
  school,
  answer,
  reference,
  logo
) => {
  try {
    const doc = new PDFDocument();
    doc.info.Title = "Pastquestion";
    doc.info.Author = "FrontiersCabal";
    doc.info.Subject = courseTitle;
    doc.info.Keywords = `pastquestion, answers, FrontiersCabal, Fc, ${courseCode}, ${courseTitle}, ${school}, ${level}`;
    doc.info.Producer = "FrontiersCabal";
    doc.info.Creator = "FrontiersCabal";

    doc.font("Times-Roman");

    doc.image(logo, 25, 25, { width: 80 }).moveDown(2);

    doc
      .fontSize(10)
      .font("Helvetica-Oblique")
      .text("Learning never exhaust the mind...", { align: "center" })
      .moveDown(3);
    const startX = 50;
    const startY = 120;

    const boxWidth = 350;
    const boxHeight = 110;
    const ruleY = 30;
    const ruleX1 = 0;
    const ruleX2 = doc.page.width;

    doc.rect(startX, startY, boxWidth, boxHeight).fill("#176984");

    doc
      .fontSize(12)
      .fillColor("#fff")
      .font("Times-Bold")
      .text(`Course Title: ${courseTitle}`, startX + 10, startY + 10, {
        align: "left",
      })
      .moveDown();
    doc
      .fontSize(12)
      .fillColor("#fff")
      .font("Times-Bold")
      .text(`Course Code: ${courseCode}`, startX + 10, startY + 30, {
        align: "left",
      })
      .moveDown();
    doc
      .fontSize(12)
      .fillColor("#fff")
      .font("Times-Bold")
      .text(`Level: ${level}`, startX + 10, startY + 50, { align: "left" })
      .moveDown();
    doc
      .fontSize(12)
      .fillColor("#fff")
      .font("Times-Bold")
      .text(`Session: ${session}`, startX + 10, startY + 70, { align: "left" })
      .moveDown();
    doc
      .fontSize(12)
      .fillColor("#fff")
      .font("Times-Bold")
      .text(`School: ${school}`, startX + 10, startY + 90, { align: "left" })
      .moveDown(3);

    if (typeof image === "string") {
      doc.image(image, {
        fit: [500, 500],
        align: "center",
        valign: "center",
      });
    } else {
      for (let i = 0; i < image?.length; i++) {
        doc.image(image[i], {
          fit: [500, 500],
          align: "center",
          valign: "center",
        });
        if (i < image.length - 1) {
          doc.addPage({ margin: 10 });
        }
      }
    }

    if (answer) {
      doc.addPage({ margin: 10 });
      doc.fontSize(18).font("Times-Bold").text("Answers");
      doc.moveTo(ruleX1, ruleY).lineTo(ruleX2, ruleY).stroke("#ccc").moveDown();
      const lines = answer.split("\n");
      for (const line of lines) {
        if (doc.y + doc.heightOfString(line) > 750) {
          doc.addPage({ margin: 10 });
        }
        doc
          .fontSize(14)
          .font("Times-Roman")
          .text(line, 10, doc.y, { align: "justify", lineGap: 10 });
      }
      doc.addPage({ margin: 10 });

      doc.fontSize(18).font("Times-Bold").text("Reference");
      doc.moveTo(ruleX1, ruleY).lineTo(ruleX2, ruleY).stroke("#ccc").moveDown();
      doc
        .fontSize(12)
        .text(reference, { align: "justify", continued: true })
        .addPage({ margin: 10 });

      doc.fontSize(18).font("Times-Bold").text("Note!!").moveDown();
      doc
        .fontSize(12)
        .font("Helvetica-Oblique")
        .text(
          "These answers were meticulously compiled from various sources. However, Users of this material are advised to exercise caution and independently verify the information provided therein.",
          { align: "justify" }
        );
    }
    //Remove any non word characters (excluding letters, digits, and underscore) from course title
    const newFilename = courseTitle?.replace(/[^\w\s]/g, "");

    const outputStream = fs.createWriteStream(newFilename);

    doc.pipe(outputStream);

    await new Promise((resolve, reject) => {
      outputStream.on("finish", resolve);
      outputStream.on("error", reject);
      doc.end();
    });

    const result = await cloudinary.v2.uploader.upload(newFilename, {
      folder: "PastQuestionDoc",
      overwrite: true,
      public_id: newFilename.trim(),
    });

    if (fs.existsSync(newFilename)) {
      fs.unlinkSync(newFilename);
    }

    return result;
  } catch (err) {
    throw err;
  }
};

export {pdfGen};
