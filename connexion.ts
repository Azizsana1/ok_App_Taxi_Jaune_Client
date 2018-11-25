import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { InscriptionPage } from '../inscription/inscription'; 
import { AuthserviceProvider } from '../../providers/authservice/authservice';

import { User } from '../../models/user';   
import { HomePage } from '../home/home';
import { Events } from 'ionic-angular';
// import { ProfilePage } from '../profile/profile';
// import {AngularFireAuth} from 'angularfire2/auth';  

@IonicPage()
@Component({ 
  selector: 'page-connexion',
  templateUrl: 'connexion.html',
})
export class ConnexionPage 
{

  user = {} as User;  
  logo=
  {
    image:'assets/imgs/logo2.png'
  } 
  responseData : any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public toastCtrl: ToastController, 
              public loadingCtrl: LoadingController, 
              public authserviceProvider:AuthserviceProvider,
              public menuCtrl: MenuController,
              public events: Events
              // , private fireAuth: AngularFireAuth
            )  
  { 
    if (localStorage.getItem('userData'))
    {
      this.events.publish('user:login');
      this.navCtrl.setRoot(HomePage); 
    }
    this.menuCtrl = menuCtrl;
  }
 
  ionViewDidLoad() 
  {
    console.log('Chargement de la page ConnexionPage');
   //  this.menuCtrl.enable(false); 
  }

  ionViewWillEnter() 
  {
     this.menuCtrl.enable(false); // A remettre absolument au finale 
    // this.nav.swipeBackEnabled = false; 
  }

  se_connecter(user: User)
  {
    if(this.user.tel && this.user.password)
    {
     this.authserviceProvider.postData(this.user, "login").then((result) =>
     { 
         this.responseData = result;
         console.log(this.responseData);
         if (this.responseData.userData)
         { 
           localStorage.setItem('userData', JSON.stringify(this.responseData))
           //Message to show user
            //  console.log(this.responseData);
             const success = this.toastCtrl.create({ 
               // message: `Bienvenu ${this.responseData.userData}`,   
               message: `Bienvenu !`,
               duration: 1500
             });            
             success.present();

             this.events.publish('user:login');

             this.navCtrl.setRoot( HomePage, {}, {animate: true});
         }
         else
         {
           const error = this.toastCtrl.create({ 
             message: 'Compte inexistant - Veuillez entrer un numéro de telephone  et mot de passe valide',
             duration: 3000
           }); 
           error.present();
         }
     }, 
     (err) =>
     {
         const msg_error = this.toastCtrl.create({
           message: 'Error: votre authentification a échoué, probablement la connexion au serveur de base de données ou bien le serveur n est pas disponible à cet instant. Erreur: ' + err,
           duration: 3000,
           cssClass: "error"
         });
         msg_error.present();
       });
   }
   else
   {
     console.log("Veuillez entrer le numéro de telephone et le mot de passe");
     const msg_error = this.toastCtrl.create(
       {
         message: 'Veuillez entrer le numéro de telephone et le mot de passe ',
         duration: 3000,
         cssClass: "error"
       });
     msg_error.present();
   }

    /* try 
    {
      const info = 1; //await this.fireAuth.auth.signInWithEmailAndPassword(user.email, user.password);

      if (info) 
      {
        // await this.navCtrl.setRoot(HomePage);  
        await this.navCtrl.setRoot(ProfilePage);   
        const success = this.toastCtrl.create({
          message: 'Bienvenue !',
          duration: 3000
        });
        success.present();
        this.menuCtrl.enable(true);
      }
    }
    catch(e) 
    {
      console.log(e);
      var errorCode = e.code;
      var errorMessage = e.message;
      if (errorCode === 'auth/argument-error')    // 1
      {
        if (errorMessage === 'signInWithEmailAndPassword failed: First argument \"email\" must be a valid string.') 
        {
          const msg_error1 = this.toastCtrl.create({
            message: 'Error: Le champ email ne doit pas être vide - ' + errorCode + ' - ' + errorMessage,
            duration: 3000,
            cssClass: "error"
          });
          msg_error1.present(); 
        }
      } 
      else if (errorCode === 'auth/argument-error')   // 2
      {
        if (errorMessage === 'signInWithEmailAndPassword failed: Second argument "password" must be a valid string.') 
        {
          const msg_error1 = this.toastCtrl.create({
            message: 'Error: Le champ mot de passe ne doit pas être vide - ' + errorCode + ' - ' + errorMessage,
            duration: 3000,
            cssClass: "error"
          });
          msg_error1.present();
        }
      }
      else if (errorCode === 'auth/invalid-email') // 3
      {
        if (errorMessage === 'The email address is badly formatted.') 
        {
          const msg_error1 = this.toastCtrl.create({
            message: 'Error: Le champ email doit avoir le format exact d\'une adresse email - ' + errorCode + ' - ' + errorMessage,
            duration: 3000,
            cssClass: "error"
          });
          msg_error1.present();
        }
      } 
      else if (errorCode === 'auth/network-request-failed') // 4
      {
        if (errorMessage === 'A network error (such as timeout, interrupted connection or unreachable host) has occurred.') 
        {
          const msg_error1 = this.toastCtrl.create({
            message: 'Error: Problème de connection reseau ou timeout atteind - ' + errorCode + ' - ' + errorMessage,
            duration: 3000,
            cssClass: "error"
          });
          msg_error1.present();
        }
      }
      else if (errorCode === 'auth/wrong-password') // 5
      {
        if (errorMessage === 'The password is invalid or the user does not have a password.') 
        { 
          const msg_error1 = this.toastCtrl.create({
            message: 'Error: Mot de passe incorrect ou compte sans mot de passe - ' + errorCode + ' - ' + errorMessage,
            duration: 3000,
            cssClass: "error"
          });
          msg_error1.present();
        }
      }
      else if (errorCode === 'auth/user-not-found') // 6
      {
          const msg_error1 = this.toastCtrl.create({
            message: 'Error: Compte introuvable - ' + errorCode + ' - ' + errorMessage,
            duration: 3000,
            cssClass: "error"
          });
          msg_error1.present();
      }
      else
      {
        const msg_error = this.toastCtrl.create({
          message: 'Error: votre authentification a échoué, compte introuvable ou probablement la connexion - ' + errorCode + ' - ' + errorMessage,
          duration: 3000,
          cssClass: "error"
        });
        msg_error.present();  
        console.log(e);
      }
    } */
  }

  inscrire() 
  {
    // Afficher la page d'inscription
    this.navCtrl.push(InscriptionPage) 
    // this.menuCtrl.enable(true); // A supprimer dans la version finale
  }

    /*
  onPageDidEnter() {
    // the left menu should be disabled on the login page
    this.menuCtrl.enable(false);
  }

  onPageDidLeave() {
    // enable the left menu when leaving the login page
    this.menuCtrl.enable(true);
  } */

}
