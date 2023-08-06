const FormData = require("../DataContext/Model/FormData");
const Response = require("../DataContext/Model/Response");
const Answers = require("../DataContext/Model/Answer");

var uniqid = require("uniqid");

async function AddFormData(data, userId) {
  let stringfy_formdata = JSON.stringify(data.fields);
  let Obj_formData = new FormData({
    UserId: userId,
    Name: data.Obj.name,
    Title: data.Obj.title,
    Description: data.Obj.description,
    FormData: stringfy_formdata,
    Access: ["*"],
    IsActive: true,
    Status: true,
  });
  var response = await Obj_formData.save();
  return response;
}

async function UpdateformData(data, userId) {
  console.log(data);
  let stringfy_formdata = JSON.stringify(data.fields);
  let formData = await FormData.findById(data.formId);
  formData.FormData = stringfy_formdata;
  formData.UserId = userId;
  formData.Name = data.Obj.name;
  formData.Title = data.Obj.title;
  formData.Description = data.Obj.description;

  var response = await FormData.findByIdAndUpdate(data.formId, formData, {
    new: true,
  });
  return response;
}

async function GetformDataByformId(formId) {
  let formData = await FormData.findById(formId);
  return formData;
}

async function GetUserRecentsFormData(userId) {
  const formData = await FormData.find({ UserId: userId, IsActive: true });
  return formData;
}

//Update form settings
async function updateFormSetting(data) {
  console.log(data);
  let formData = await FormData.findById(data.formId);
  if (data.allTimeAccess) {
    formData.Start_Datetime = null;
    formData.End_Datetime = null;
  } else {
    formData.Start_Datetime =
      data.startDateTime != "" ? new Date(data.startDateTime) : null;
    formData.End_Datetime =
      data.endDateTime != "" ? new Date(data.endDateTime) : null;
  }
  formData.Status = data.status;
  if (data.access === "") {
    formData.Access = ["*"];
  } else {
    if (JSON.parse(data.access) == 0) {
      formData.Access = ["*"];
    } else {
      formData.Access = JSON.parse(data.access);
    }
  }
  var response = await FormData.findByIdAndUpdate(data.formId, formData, {
    new: true,
  });
  return response;
}

async function updateFormStatus(data) {
  let formData = await FormData.findById(data.formId);
  formData.Status = data.status;
  var response = await FormData.findByIdAndUpdate(data.formId, formData, {
    new: true,
  });
  return response;
}

async function DeleteForm(formId) {
  let formData = await FormData.findById(formId);
  formData.IsActive = false;
  var response = await FormData.findByIdAndUpdate(formId, formData, {
    new: true,
  });
  return response;
}

async function getFormlink(formId, userId) {
  let response = await Response.find({ FormId: formId, UserId: userId });
  if (response.length > 0) {
    return response[0].ResponseId;
  } else {
    const responseId = uniqid();
    let newResponse = new Response({
      FormId: formId,
      UserId: userId,
      ResponseId: responseId,
    });
    const data = await newResponse.save();
    return data.ResponseId;
  }
}

//get form for user submission only one submission is required
async function GetFormForUserResponse(formId, responseId, userEmail) {
  let response = await Response.find({
    ResponseId: responseId,
    FormId: formId,
  });
  let answer = await Answers.find({ UserEmail: userEmail });
  //If form is not found
  if (response.length == 0) {
    let Obj = {
      form: null,
      Response: "Response not found",
    };
    return Obj;
  }
  //single submission or multiple submission
  // if (answer.length > 0) {
  //   let Obj = {
  //     form: null,
  //     Response: "Submission have done",
  //   };
  //   return Obj;
  // }
  //if user is found and form is also found
  if (response.length > 0) {
    let form = await FormData.findById(formId);
    console.log(form);
    //startDate And EndDateTime
    const startDateTime = new Date(form.Start_Datetime);
    const endDateTime = new Date(form.End_Datetime);
    // Get the current date and time
    const currentDate = new Date();
    console.log(currentDate);
    const status = form.Status;

    if (form && form.IsActive) {
      const access = form.Access;
      if (access[0] === "*") {
        if (status) {
          if (form.Start_Datetime == null && form.End_Datetime == null) {
            let Obj = {
              form: form,
              Response: "formData is found",
            };
            return Obj;
          } else {
            if (currentDate > startDateTime && currentDate < endDateTime) {
              let Obj = {
                form: form,
                Response: "formData is found",
              };
              return Obj;
            } else {
              let Obj = {
                form: null,
                Response: "Form is not start",
              };
              return Obj;
            }
          }
        } else {
          let Obj = {
            form: null,
            Response: "Response not taken to longer",
          };
          return Obj;
        }
      } else {
        let userAccess = access.filter(function (element) {
          return element == userEmail;
        });

        if (userAccess.length > 0) {
          if (status) {
            if (form.Start_Datetime == null && form.End_Datetime == null) {
              let Obj = {
                form: form,
                Response: "formData is found",
              };
              return Obj;
            } else {
              if (currentDate > startDateTime && currentDate < endDateTime) {
                let Obj = {
                  form: form,
                  Response: "formData is found",
                };
                return Obj;
              } else {
                let Obj = {
                  form: null,
                  Response: "Form is not start",
                };
                return Obj;
              }
            }
          } else {
            let Obj = {
              form: null,
              Response: "Response not taken to longer",
            };
            return Obj;
          }
        } else {
          let Obj = {
            form: null,
            Response: "User not access for this form ",
          };
          return Obj;
        }
      }
    } else {
      let Obj = {
        form: null,
        Response: "Form is deleted or invalid",
      };
      return Obj;
    }
  }
}

//as we taking all input fields required
async function submitFormResponse(data, responseId) {
  const formDataValue = JSON.stringify(data.fields);
  const answer = new Answers({
    UserEmail: data.email,
    FormData: formDataValue,
    ResponseId: responseId,
  });

  const response = await answer.save();
  return response;
}

async function getAllFormResponses(formId){
  let response=await Response.find({FormId: formId});
  if(response.length>0){
    let answers=await Answers.find({ResponseId: response[0].ResponseId});
    return answers;
  }
  return response;
}

async function getAnswer(answerId){
  let answer = await Answers.findById(answerId);
  return answer;
}


module.exports = {
  AddFormData,
  UpdateformData,
  GetformDataByformId,
  GetUserRecentsFormData,
  updateFormSetting,
  updateFormStatus,
  updateFormStatus,
  DeleteForm,
  getFormlink,
  GetFormForUserResponse,
  submitFormResponse,
  getAllFormResponses,
  getAnswer
};
