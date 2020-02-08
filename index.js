let PDFDocument = require('pdfkit');
let fs = require('fs');
let axios = require ('axios');
let inquirer = require ('inquirer');

inquirer.prompt({
    message: "Enter your GitHub username",
    name: "username",
    messsage: "Pick a color",
    name: "usercolor",

  })
.then(function({ username }) {
    const profile = new PDFDocument({compress:false});
    const queryUrl = `https://api.github.com/users/${username}`
    axios.get(queryUrl)
      .then(function(response){
        console.log(response);

        profile.pipe(fs.createWriteStream(`test.pdf`));

        profile
           .font('Times New Roman')
           .fontSize(25)
           .text(response.data.name, 500, 500);
        console.log("success!");
        profile.end();
       })

})