// pages/api/fileUpload.ts
const csvParser = require("csv-parser");
const redis = require("redis");
const multer = require("multer");
const converter = require("json-2-csv");
const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
import type {NextApiRequest, NextApiResponse} from "next";
import fs from "fs";
import formidable, {File, IncomingForm} from "formidable";
const {Resend} = require("resend");
const Queue = require("bull");
const {Configuration, OpenAIApi} = require("openai");
const today = new Date().toJSON().slice(0, 10).replace(/-/g, "/");

import {promisify} from "util";
const NEXT_PUBLIC_REDIS_HOST = process.env.NEXT_PUBLIC_REDIS_HOST;
// Create a Redis client
const redisClient = redis.createClient({
  host: NEXT_PUBLIC_REDIS_HOST,
  port: 6379,
});

// Promisify Redis set and del functions
// const asyncRedisSet = promisify(redisClient.set).bind(redisClient);
// const asyncRedisDel = promisify(redisClient.del).bind(redisClient);

// Configure Next.js API route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Define the API route handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Define an array of Excel file MIME types
  const excelFileMimeTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  // Create a Resend instance using an access token
  const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_ACCESS_TOKEN);

  // Create a Bull Queue for processing CSV data
  const csvQueue = new Queue("csvProcessing",);

  // Create an OpenAI configuration and API instance
  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // Define a function to clean company names using OpenAI
  async function cleanCompanyNames(companyNames: string[]) {
    const cleanedCompanyNames = [];

    for (const name of companyNames) {
      if (name && !isNaN(parseFloat(name))) {
        cleanedCompanyNames.push(name);
      } else {
        const prompt = name + "\n\n###\n\n";
        const completion = await openai.createCompletion({
          model: "curie:ft-personal:trainingdatacurie-2023-04-05-22-29-33",
          prompt,
          temperature: 0.5,
          max_tokens: 15,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          stop: ["END"],
        });
        let companyNameCleaned = completion.data.choices[0].text;
        if (companyNameCleaned?.trim() !== companyNameCleaned) {
          companyNameCleaned = companyNameCleaned?.trim();
        }
        if (companyNameCleaned !== undefined) {
          cleanedCompanyNames.push(companyNameCleaned);
        }
      }
    }
    return cleanedCompanyNames;
  }

  // Define a function to save cleaned company names to Redis
  // async function saveCleanedCompanyNamesToRedis(
  //   email: string,
  //   cleanedCompanyNames: string[]
  // ) {
  //   await asyncRedisSet(
  //     email,
  //     JSON.stringify(cleanedCompanyNames),
  //     (err: Error) => {
  //       if (err) {
  //         console.error("Error saving data to Redis:", err);
  //       } else {
  //         console.log("Data saved to Redis successfully");
  //       }
  //     }
  //   );
  // }

  // Define arrays to store CSV data and company names
  const dataArray: any = [];
  const companyNames: string[] = [];

  // async function issueRefund(paymentIntentId: string) {
  //   try {
  //     const paymentIntent = await stripe.paymentIntents.retrieve(
  //       paymentIntentId
  //     );
  //     if (paymentIntent.status === "succeeded") {
  //       const refundAmount = paymentIntent.amount;
  //       const refund = await stripe.refunds.create({
  //         payment_intent: paymentIntentId,
  //         amount: refundAmount,
  //       });
  //       return refund;
  //     } else {
  //       throw new Error("Payment is not in a refundable state.");
  //     }
  //   } catch (error) {
  //     console.error("Error issuing refund:", error);
  //     throw error;
  //   }
  // }

  // Process CSV data in the Bull Queue
  csvQueue.process(async (job: any) => {
    const {email, paymentIntentId, path, name} = job.data;
    fs.createReadStream(path)
      .pipe(csvParser())
      .on("data", (data: any) => {
        const companyName = data["company_name"];
        if (companyName) {
          companyNames.push(companyName);
        }
        dataArray.push(data);
      })
      .on("end", async () => {
        fs.unlinkSync(path);
        let cleanedCompanyNames = await cleanCompanyNames(companyNames);
        // await saveCleanedCompanyNamesToRedis(email, cleanedCompanyNames);

        let inc = 0;
        for (const name of cleanedCompanyNames) {
          dataArray[inc].company_name_cleaned = name;
          dataArray[inc].flag = dataArray[inc].company_name === name ? 1 : 0;
          inc++;
        }
        const csv = await converter.json2csv(dataArray);

        const filePath = "cleanedFile.csv";
        fs.writeFile(filePath, csv, async (err) => {
          if (err) {
            console.error("Error saving CSV file:", err);
          } else {
            const attachmentPath = filePath;
            const attachmentContent = fs.readFileSync(attachmentPath);
            console.log("attachmentContent=============>", attachmentContent)

            // Send an email with the cleaned CSV file as an attachment
            try {
              await resend.emails.send({
                from: "company@resend.dev",
                to: [email],
                subject: "List Clean",
                html: "Below is cleaned list file",
                attachments: [
                  {
                    filename: "cleanedFile.csv",
                    content: attachmentContent,
                  },
                ],
                headers: {
                  "X-Entity-Ref-ID": "123456789",
                },
                tags: [
                  {
                    name: "category",
                    value: "send_file",
                  },
                ],
              }).then(()=>{
                console.log("email=============>", "email sent")
              });
            } catch (error) {
              // Function to issue a refund
              // issueRefund(paymentIntentId)
              //   .then((refund) => {
              //     console.log("amount refunded :", refund.id);
              //   })
              //   .catch((error) => {
              //     console.log(error);
              //   });

              // Send an email notification about the refund
              // try {
              //   await resend.emails.send({
              //     from: "mailto:company@resend.dev",
              //     to: [email],
              //     subject: "List Clean",
              //     html: `<pre>
              //       Hi,
                    
              //       I'm pleased to confirm the successful processing of a full refund for (listCleaned file)
              //       on ${today}. Unfortunately, due to technical reasons, we were unable to process your 
              //       file as intended. We understand your frustration and apologize for any inconvenience 
              //       caused.
                    
              //       Please expect the funds to be reflected in your account within 5 to 10 days.
                    
              //       Your patience and understanding are greatly appreciated.
                    
              //       Best regards,
              //       ListClean
              //       </pre>`,
              //     headers: {
              //       "X-Entity-Ref-ID": "123456789",
              //     },
              //     tags: [
              //       {
              //         name: "category",
              //         value: "refund",
              //       },
              //     ],
              //   });
              // } catch (error) {
              //   res.status(500).json({error: "Email refund Failed!"});
              // }
            }

            fs.unlink(attachmentPath, (err) => {
              if (err) {
                console.error("Error deleting CSV file:", err);
              }
            });
          }
        });

        // Delete temporary data from Redis
        // await asyncRedisDel(email, (err: Error) => {
        //   if (err) {
        //     console.error("Error deleting temporary file from Redis:", err);
        //   } else {
        //     console.log("Temporary file deleted from Redis successfully");
        //   }
        // });
      })
      .on("error", (error: Error) => {
        res.status(500).json({error: "Error processing the CSV file!"});
      });
  });

  // Handle POST requests
  if (req.method === "POST") {
    // Parse the form data using the formidable library
    const fData = await new Promise<{fields: any; files: any}>(
      (resolve, reject) => {
        const form = new IncomingForm({
          multiples: false,
        });
        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);
          resolve({fields, files});
        });
      }
    );

    try {
      // Log form data and extract file path
      console.log("form data :>> ", fData);
      const filePath = fData.files.file[0].filepath;
      console.log("Filepath :>> ", filePath);
      if (!filePath) {
        return res.status(400).json({error: "Please upload a CSV file!"});
      }

      // Add a job to the Bull Queue for CSV processing
      const {email, paymentIntentId, name} = fData.fields;
      csvQueue.add({
        path: filePath,
        email: email[0],
        paymentIntentId: paymentIntentId[0],
        name: name[0],
      });
    } catch (error) {
      console.error("Error reading file:", error);
    }

    res.json({success: true});
  }
}