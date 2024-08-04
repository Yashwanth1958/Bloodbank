import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";

const app =express();
const port =3000;
app.use('/public',express.static('public'));


const db = new pg.Client(
    {
        user:"postgres",
        host:"localhost",
        database:"blood",
        password:"12345678",
        port:5432
     }
);
try{
db.connect();
}
catch{
    console.error();
} 
//const res=db.query("select * from blood_donor2");
//console.log(res)

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set("view engine ",'ejs');

app.get("/",(req,res)=>{
    res.render("webpage.ejs");
});
app.get("/views/webpage.ejs",(req,res)=>{
    res.render("webpage.ejs");
});

app.get("your_login_server_endpoint",(req,res)=>{
    res.render("login.ejs");
})

app.get("/views/login.ejs",(req,res)=>{
    res.render("login.ejs");
});
app.get("/views/founder.ejs",(req,res)=>{
    res.render("founder.ejs");
});
app.get("/views/aboutus.ejs",(req,res)=>{
    res.render("aboutus.ejs");
});
app.get("/views/register.ejs",(req,res)=>{
    res.render("register.ejs");
});
app.get("/views/contact.ejs",(req,res)=>{
    res.render("contact.ejs");
    
}); 
app.get("/views/emergency.ejs", (req,res)=>{
    res.render("emergency.ejs");
});

app.get("/views/search.ejs",(req,res)=>{
    res.render("search.ejs");
});

app.get("/views/adminlogin.ejs",(req,res)=>{
    res.render("adminlogin.ejs");
});                                                          
app.get("/views/adminwebpage.ejs",(req,res)=>{
    res.render("adminwebpage.ejs");
});
app.get("/views/adminregisterdata.ejs",async (req,res)=>{
    const result1=await db.query("select * from registerdata");
    const resultlist=result1.rows;
    console.log(resultlist);
    res.render("adminregisterdata.ejs",{resultlist});
});
app.get("/views/admincontactus.ejs", (req,res)=>{
    
    res.render("admincontactus.ejs");
});
app.get("/views/adminemergency.ejs", async (req,res)=>{
    const emerdata=await db.query("select * from emergencytable");
    const emerbase=emerdata.rows;
    console.log(emerbase);
    res.render("adminemergency.ejs",{emerbase});
});



app.get("/views/list.ejs",(req,res)=>{
    
    res.render("list.ejs");

    

})

app.post("/views/adminregisterdata.ejs",async (req,res)=>{

    const result1=await db.query("select * from registerdata");
    const resultlist=result1.rows;
    console.log(resultlist);
    
    res.render("adminregisterdata.ejs",{resultlist})
    
});
app.post("/views/list.ejs",(req,res)=>{

    const result1=db.query("select * from registerdata")
    const res1=result1.rows;
    console.log(res1);
    res.render("list.ejs",{res1})

});
app.post("/views/login.ejs",async(req,res)=>{
    const username=req.body.username;
    const password =req.body.password;
    console.log(username + " "+ password);

    const result=await db.query("select * from registerdata where username =$1 ",[username]);
    const result2=result.rows;
    console.log(result2);
    const dbpassword=result2[0].password;
    console.log(dbpassword);
    const user=result2.username;
    console.log(dbpassword);


    if (password===dbpassword ){

        res.render("search.ejs");

    }
    else{
        res.send("invalid user");
    }
})
app.post("/views/register.ejs",(req,res)=>{
    //const{name,email,Mobile,username,password,blood-type}=req.body.name;
    const name=req.body.name;
    const email=req.body.email;
    const mobile=req.body.Mobile;
    const username=req.body.username;
    const password=req.body.password;
    const bloodtype=req.body.bloodtype;
    const district=req.body.district;
    console.log(name + email + mobile + username + password + bloodtype + district );
    db.query('insert into registerdata(name,email,mobile,username,password,bloodtype,district) values ($1,$2,$3,$4,$5,$6,$7)',[name,email,mobile,username,password,bloodtype,district]);
     res.send("registration succesfull thank you for registaring")

});
app.post("/views/emergency.ejs", async (req,res)=>{
    const patient= req.body.Patient
    const age = req.body.Age;
    const blood =req.body.Blood;
    const hospital=req.body.Hospital;
    const contactnumber=req.body.Contact;
    const closeofemergency=req.body.Closeofemergency;
    console.log(patient + age + blood + hospital + contactnumber + closeofemergency );
    db.query("insert into emergencytable (patient,age,blood,hospital,contactnumber,closeofemergency) values ($1,$2,$3,$4,$5,$6)",[patient,age,blood,hospital,contactnumber,closeofemergency]);
    res.send("patient details has been sucesfull saved. will respond as soon as possible")
    console.log("register sucessfully");
});

app.post("/views/search.ejs",async(req,res)=>{
    const bloodgroup =req.body.BloodGroup;
    const district =req.body.District;
    console.log(bloodgroup + " "+district);
    const resultdata=await db.query("select * from registerdata where  district=$1 and bloodtype=$2 ",[district,bloodgroup]);
    const resultdata2=resultdata.rows;
    const renderdata=resultdata2;
    console.log(renderdata);
    


    res.render("list.ejs",{renderdata});
    


})
app.post("/views/adminlogin.ejs",async (req,res)=>{
    const user=req.body.username;
    const password =req.body.password;
    console.log(user + ""+ password);
    const resultadmin =await db.query("select * from admin where username= $1 ",[user]);
    console.log(resultadmin.rows);
    const constdata=resultadmin.rows[0];
    const userdatabase=constdata.username;
    const passwordata=constdata.password;
    console.log(userdatabase);
    console.log(passwordata);

    if(password===passwordata){
        res.render("adminwebpage.ejs");
    }
    console.log(constdata);



})
app.post("/adminlogin.ejs",async (req,res)=>{
    const user=req.body.username;
    const password =req.body.password;
    console.log(user + ""+ password);
    const resultadmin =await db.query("select * from admin where username= $1 ",[user]);
    console.log(resultadmin,rows);


});
app.post("adminregisterdata.ejs",(req,res)=>{
   


})
/*
app.post("/views/login.ejs",(req,res)=>{
    const result=req.body
    console.log(result);
    const result1 =db.query('select * from blooddonarlist ')
    console.log(result1)
})*/


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yashwanthappid@gmail.com',
      pass: 'SANthosh@195'
    }
  });
  
  var mailOptions = {
    from: 'yashwanthappidi@gmail.com',
    to: 'yashwantappidi@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

app.listen(port,()=>{
    console.log('the server is running at ${port}')
});