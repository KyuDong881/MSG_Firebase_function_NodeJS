const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
exports.checkReservations_User = functions.firestore.document('/UserProducts/{uproduct_ID}')
.onCreate((snap,context) => {

  const newValue = snap.data();
  const reservationTitle = newValue.title;

  var db = admin.firestore();
  let reservationRef = db.collection('Reservations');
  let reservprod = reservationRef.get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      var keyword = doc.data()["keyword"];
      var userToken = doc.data()["user_token"];
      if(keyword===reservationTitle) {
        sendPushToReserveUser(keyword,userToken);
      }
    });
    return null;
  })
  .catch(err => {
    console.log('Error getting documents',err);
  });

  var sendPushToReserveUser = (keyword,user_token) => {  
    var message = {
      notification:{
          title:'예약 상품이 올라왔어요!!',
          body:'예약 상품 : '+ keyword
       },
    
      data: {
        title:'예약 상품이 올라왔어요!!',
        body:'예약 상품 : '+ keyword

      },
      token: user_token
    };

    sendPushMessage(message);
    return null;
  }

  var sendPushMessage = (message) => {
    admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message',response);
      return null;
    })
    .catch((error)=> {
      console.log(error);
    })
  }
})




exports.pushToSubscriber = functions.firestore.document('/ResProducts/{rproduct_ID}')
.onCreate((snap,context) => {

  const resID = snap.data();
  const target = resID.res_id;
  const newProduct = resID.title;
  const promise = [];
  var db = admin.firestore();
  var message = {
    notification:{
        title:'구독 식당에서 새로운 상품이 올라왔어요!!',
        body: newProduct
  },
     data: {

  },
    topic: target
  };
  admin.messaging().send(message)
  .then((response) => {
    console.log('Successfully sent message',response);
    return null;
  })
  .catch((error)=> {
    console.log(error);
  })
})


exports.approvedRestaurant = functions.firestore.document('/Restaurant/{res_id}')
.onUpdate((change, context) => {
  const newValue = change.after.data()['approved'];
  const res_token = change.before.data()['res_token'];
  console.log(newValue + "  " + res_token);
  var message = {
    notification:{
        title:'승인이 완료되었어요',
        body:''
      },
    
    data: {
      title:'승인이 완료되었어요',
      body:''

    },
    token: res_token
  }

  if(newValue) {  
    admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message',response);
      return null;
    })
    .catch((error)=> {
      console.log(error);
    })
  }
  return null;
})

exports.checkReservations_Res = functions.firestore.document('/ResProducts/{rproduct_ID}')
.onCreate((snap,context) => {
  const newValue = snap.data();
  const reservationTitle = newValue.title;


  var db = admin.firestore();
  let reservationRef = db.collection('Reservations');
  let reservprod = reservationRef.get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      var keyword = doc.data()["keyword"];
      var userToken = doc.data()["user_token"];
      if(keyword===reservationTitle) {
        sendPushToReserveUser(keyword,userToken);
      }
    });
    return null;
  })
  .catch(err => {
    console.log('Error getting documents',err);
  });



  var sendPushToReserveUser = (keyword,user_token) => {  
    var message = {
      notification:{
          title:'예약 상품이 올라왔어요!!',
          body:'예약 상품 : '+ keyword
       },
    
      data: {
        title:'예약 상품이 올라왔어요!!',
        body:'예약 상품 : '+ keyword

      },
      token: user_token
    };

    sendPushMessage(message);
    return null;
  }

  var sendPushMessage = (message) => {
    admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message',response);
      return null;
    })
    .catch((error)=> {
      console.log(error);
    })
  }

})


