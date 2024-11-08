const otpModel = require("../models/otpModel");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");


const smsOtp = async (data) => {
  try {
    const otp = otpGenerator.generate(4, 
      {
        digits: true, 
        alphabets: false, 
        upperCaseAlphabets: false, 
        lowerCaseAlphabets: false, 
        specialChars: false,
      });

      let Otpdata;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^\d{10}$/;
      
      if (emailPattern.test(input)) {
        Otpdata = new otpModel({ email: data, otp: otp });
      } else if (phonePattern.test(input)) {
        Otpdata = new otpModel({ phoneNo: data, otp: otp });
      } else {
        return { status: false };
      }
      await Otpdata.save();
      return { status: true };
    } catch (error) {
      console.log("error in otp genarator", error);
      return { status: false };
    }
  };
  exports.smsOtp = smsOtp;
  
  
  const otpValidiation = async (userdata, otp) => {
      try {
          const otpEmail = await otpModel.findOne({ email: userdata });
          const otpPhoneNo = await otpModel.findOne({ phoneNo: userdata });
          let validate;
          if (otpEmail){
              validate = bcrypt.compare(otp, otpEmail.otp)
            } else if (otpPhoneNo)
            {
                validate = bcrypt.compare(otp, otpPhoneNo.otp) 
            }
          if (validate) {
                console.log('validation complete');
                return { status: true };
            }
        } catch (error) {
            console.log('error in otp genarator');
            return { status: false };
        }
    };
  exports.otpValidiation = otpValidiation;



  