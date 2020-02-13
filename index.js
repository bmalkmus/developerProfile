let PDFDocument = require('pdfkit');
let fs = require('fs');
let axios = require ('axios');
let inquirer = require ('inquirer');

inquirer.prompt([
    {
      message: "Enter your GitHub username",
      name: "username",
    },
    { 
      message:"What is your favorite color?",
      name: "favoriteColor",
    },
  ])
.then(function({ username, favoriteColor }) {
    const profile = new PDFDocument({compress:false});
    page = profile.page;
    console.log('maxWidth =', page.width,' maxHeight=', page.height, "margin = ", page.margin);
    const queryUrl = `https://api.github.com/users/${username}`
    axios.get(queryUrl)
      .then(function(response){

        profile.pipe(fs.createWriteStream(`${username}.pdf`));

        profile.info['Title']= `${response.data.name}`;
        let grad = profile.linearGradient(0, 0, 612, 792)
        grad
        .stop(0, favoriteColor)
        .stop(1, 'black');
        profile.rect(0, 0, 612, 792)
        profile.fill(grad);

        profile
          .rect(200, 110, 160, 160)
          .roundedRect(72, 515, 200, 72, 15)
          .roundedRect(375, 515, 200, 72, 15)
          .roundedRect(72, 615, 200, 72, 15)
          .roundedRect(375, 615, 200, 72, 15)
          .fillAndStroke(favoriteColor, 'white');


        profile
          .fillColor('black')
           .font('fonts/MeriendaOne-Regular.ttf')
           .fontSize(40)
           .text(response.data.name, 20, 10, {align: 'center', fill:"true", stroke:'true'});

           axios.get(response.data.avatar_url, {responseType: 'arraybuffer'}).then(reply => {
            const pngBuffer = Buffer.from(reply.data);
            profile.image(pngBuffer, 205, 115, {align: 'center', valign: 'center', width: 150, height: 150,});

          });

        profile 
        .fontSize(16)
        .font('fonts/Lobster-Regular.ttf')
        .text( response.data.location, 0, 300, { align:'center',
          link: `http://google.com/maps/place/${response.data.location}`,
          underline: true
        });

        profile
          .fontSize(15)
          .text("Blog", 72, 300, {align: 'left', link: response.data.blog, underline:true});

        profile
          .text("GitHub", 0, 300, {align: 'right', link: response.data.html_url, underline:true});

        profile
          .fontSize (16)
          .fillColor('white')
          .text(response.data.bio, 150, 350)
          .fontSize(18)
          .fillColor("white")
          
          .text(`Public Repositories: ${response.data.public_repos}`, 95, 535)
          .text(`Followers: ${response.data.followers}`, 400, 535)
          .text(`Following: ${response.data.following}`, 125, 630);

        axios.get("https://api.github.com/users/"+username+"/repos?client_id=${}&client_secret=${}")
          .then(function(result){
            profile.text (`GitHub Stars: ${result.data.length}`, 400, 630);
            console.log("PDF created!")
            profile.end();
          });


       })

})