let PDFDocument = require('pdfkit');
let fs = require('fs');
let axios = require ('axios');
let inquirer = require ('inquirer');

inquirer.prompt(
    {
      message: "Enter your GitHub username",
      name: "username",
    },
    { 
      message:"What is your favorite color?",
      name: "favoriteColor"
    },
)
.then(function({ username }) {
    const profile = new PDFDocument({compress:false});
    const queryUrl = `https://api.github.com/users/${username}`
    axios.get(queryUrl)
      .then(function(response){
        console.log(response);

        profile.pipe(fs.createWriteStream(`profile.pdf`));

        profile.info['Title']= `${response.data.name}`;


        profile
          //  .font('Times Roman')
           .fontSize(30)
           .text(response.data.name, 180, 50);
          //  .image(response.data.avatar_url, 400, 150);

        profile 
        .fontSize(12)
        .text(response.data.location, 65, 250, {
          link: `http://google.com/maps/place/${response.data.location}`,
          underline: false
        });

        profile
          .fontSize(12)
          .text("Blog", 315, 250, {link: response.data.blog, underline:false});

        profile
          .text("GitHub", 500, 250, {link: response.data.html_url, underline:false});

        profile
          .fontSize (16)
          .text(response.data.bio, 150, 300)
          .fontSize(12)
          .text(`Public Repostiories: ${response.data.public_repos}`, 100, 500)
          .text(`Followers: ${response.data.followers}`, 375, 500)
          .text(`Follwing: ${response.data.following}`, 100, 600);
          // .text (`GitHub Stars:`, 375, 600);

        axios.get("https://api.github.com/users/"+username+"/repos?client_id=${}&client_secret=${}")
          .then(function(result){
            console.log(result.data.length);
            profile.text (`GitHub Stars: ${result.data.length}`, 375, 600);
            profile.end();
          });

        console.log("success!");

       })

})