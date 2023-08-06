const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();
const FormService = require("../Service/FormService");
const VerfifyFetchUserService = require("../Middleware/VerifyUser");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// Set up multer storage
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/create", VerfifyFetchUserService, createForm);
router.put("/update", VerfifyFetchUserService, updateForm);
router.get("/getbyid/:formid", VerfifyFetchUserService, getFormByIdForm);
router.get("/getrecentForms", VerfifyFetchUserService, getRecentForm);
router.get("/getName", VerfifyFetchUserService, getName);
router.get(
  "/getformsetting/:formid",
  VerfifyFetchUserService,
  getFormForSetting
);
router.put("/updateformsetting", VerfifyFetchUserService, updateFormSetting);
router.put("/updateformstatus", VerfifyFetchUserService, updateFormStatus);
router.delete("/deleteform/:formid", VerfifyFetchUserService, deleteForm);
router.get("/getformlink/:formid", VerfifyFetchUserService, getFormLink);
router.post(
  "/getform/:responseId",
  getFormForResponse
);
router.post(
  "/addformresponse/:responseId",
  VerfifyFetchUserService,
  addFormResponse
);
router.get("/getallresponse/:formid", VerfifyFetchUserService, GetAllResponse);
router.get("/getanswerbyid/:formid", VerfifyFetchUserService, getAnswerById);
router.post(
  "/upload",
  VerfifyFetchUserService,
  upload.single("file"),
  uploadFile
);

//Create form api
async function createForm(req, res) {
  try {
    let userId = req.userId;
    console.log("req body: ", req.body);
    let form = await FormService.AddFormData(req.body, userId);
    res.status(200).send({ data: form, Msg: "Successfully created form" });
  } catch (error) {
    console.log("Error creating form" + error.message);
    res.status(500).send("Server error: " + error.message);
  }
}

//Update form api
async function updateForm(req, res) {
  try {
    let userId = req.userId;
    let form = await FormService.UpdateformData(req.body, userId);
    res.status(200).send({ data: form, Msg: "Successfully update form" });
  } catch (error) {
    console.log("Error updating form" + error.message);
    res.status(500).send("Server error: " + error.message);
  }
}

//Get  Form by Id
async function getFormByIdForm(req, res) {
  try {
    let userId = req.userId;
    var formId = req.params.formid;
    let form = await FormService.GetformDataByformId(formId);

    let senbObj = { Obj: {}, fields: [] };
    senbObj.Obj.name = form.Name;
    senbObj.Obj.title = form.Title;
    senbObj.Obj.description = form.Description;
    senbObj.fields = JSON.parse(form.FormData);

    res.status(200).send({ data: senbObj, Msg: "Successfully get form by Id" });
  } catch (error) {
    console.log("Error updating form" + error.message);
    res.status(500).send("Server error: " + error.message);
  }
}

//Getting Recent Form
async function getRecentForm(req, res) {
  try {
    let userId = req.userId;
    let forms = await FormService.GetUserRecentsFormData(userId);
    res
      .status(200)
      .send({ data: forms, Msg: "Successfully get forms by UserId" });
  } catch (error) {
    console.log("Error updating form" + error.message);
    res.status(500).send("Server error: " + error.message);
  }
}

//Temp
async function getName(req, res) {
  try {
    res.status(200).send({ data: "Hello kaif", Msg: "Successfully get Name" });
  } catch (error) {
    console.log("Error updating form" + error.message);
    res.status(500).send("Server error: " + error.message);
  }
}

//Getting form Settings
async function getFormForSetting(req, res) {
  try {
    let userId = req.userId;
    var formId = req.params.formid;
    let form = await FormService.GetformDataByformId(formId);

    res.status(200).send({ data: form, Msg: "Successfully get form by Id" });
  } catch (error) {
    console.log("Error updating form" + error.message);
    res.status(500).send("Server error: " + error.message);
  }
}

async function updateFormSetting(req, res) {
  try {
    let userId = req.userId;
    let form = await FormService.updateFormSetting(req.body, userId);
    res
      .status(200)
      .send({ data: form, Msg: "Successfully update form setting" });
  } catch (error) {
    console.log("Error updating form setting" + error.message);
    res.status(500).send("Server error: " + error.message);
  }
}

//update form Status
async function updateFormStatus(req, res) {
  try {
    console.log(req.body);
    let userId = req.userId;
    let form = await FormService.updateFormStatus(req.body, userId);
    res
      .status(200)
      .send({ data: form, Msg: "Successfully update form setting" });
  } catch (error) {
    console.log("Error updating form setting" + error.message);
    res.status(500).send("Server error: " + error.message);
  }
}

//delete form
async function deleteForm(req, res) {
  try {
    let userId = req.userId;
    var formId = req.params.formid;
    let form = await FormService.DeleteForm(formId);
    res
      .status(200)
      .send({ data: form, Msg: "Successfully update form setting" });
  } catch (error) {
    console.log("Error updating form setting" + error.message);
    res.status(500).send("Server error: " + error.message);
  }
}

//get formLink
async function getFormLink(req, res) {
  try {
    let userId = req.userId;
    var formId = req.params.formid;
    let responseId = await FormService.getFormlink(formId, userId);

    //unique linke for taking  reponse by user
    const link = `https://mercorform.vercel.app/sendresposne/${formId}&${responseId}`;
    res.status(200).send({ data: link, Msg: "Successfully get form link" });
  } catch (error) {
    console.log("Error getting form link" + error.message);
    res.status(500).send("Server error: " + error.message);
  }
}

//Get  Form by Id
async function getFormForResponse(req, res) {
  try {
    //Get Id
    var Id = req.params.responseId;
    let formId = Id.split("&")[0];
    let responseId = Id.split("&")[1];
    let email = req.body.email;
    console.log("email: " + email);
    let FormObj = await FormService.GetFormForUserResponse(
      formId,
      responseId,
      email
    );
    let form = FormObj.form;
    if (form != null) {
      let senbObj = { Obj: {}, fields: [] };
      senbObj.Obj.name = form.Name;
      senbObj.Obj.title = form.Title;
      senbObj.Obj.description = form.Description;
      senbObj.fields = JSON.parse(form.FormData);
      res.status(200).send({
        data: senbObj,
        Msg: "Successfully get form for user response",
      });
    } else {
      res.status(200).send({ data: null, Msg: FormObj.Response });
    }
  } catch (error) {
    console.log("Error updating form" + error.message);
    res.status(500).send("Server error: " + error.message);
  }
}

//add form response
async function addFormResponse(req, res) {
  try {
    var Id = req.params.responseId;
    let responseId = Id.split("&")[1];

    console.log(req.body);
    // let fields = JSON.parse(req.body.fields);
    // console.log('fields', fields);
    // //for storing file
    // if (fields.length > 0) {
    //   fields.forEach(function (field) {

    //   });
    // }

    let FormObj = await FormService.submitFormResponse(req.body, responseId);
    res
      .status(200)
      .send({ data: FormObj, Msg: "Successfully submit response" });
  } catch (error) {
    console.log("Error adding form response" + error.message);
    res.status(500).send("Server error: " + error.message);
  }
}

async function GetAllResponse(req, res) {
  try {
    let userId = req.userId;
    let formId = req.params.formid;
    let reponses = await FormService.getAllFormResponses(formId);
    res
      .status(200)
      .send({ data: reponses, Msg: "Successfully get form all response" });
  } catch (error) {
    console.log("Error getting form link" + error.message);
    res.status(500).send("Server error: " + error.message);
  }
}

async function getAnswerById(req, res) {
  try {
    let userId = req.userId;
    let formId = req.params.formid;
    let answer = await FormService.getAnswer(formId);
    res
      .status(200)
      .send({ data: answer, Msg: "Successfully get submit response by id" });
  } catch (error) {
    console.log("Error getting form link" + error.message);
    res.status(500).send("Server error: " + error.message);
  }
}

async function uploadFile(req, res) {
  const file = req.file;

  // Upload image to Cloudinary
  cloudinary.uploader.upload(file.path, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to upload image" });
    }
    res.json({ imageUrl: result.secure_url });

    console.log({ "{ imageUrl: result.secure_url }": result.secure_url });
  });
}

module.exports = router;
