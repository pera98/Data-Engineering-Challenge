import { Component } from '@angular/core';
import { UserStatsService } from 'src/app/services/user-stats.service';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css']
})
export class UserStatsComponent {

  //form data
  user_id: string = ''
  date: string = ''

  //result data
  country: string = ''
  name: string = ''
  numberLogins: number = 0
  daysSinceLastLogin: number = 0
  numberOfSessions: number = 0
  timeSpentInGame: number = 0;

  constructor(private userStatsService: UserStatsService) {

  }

  getUserData(): void {

    this.userStatsService.getUserStats(this.user_id).subscribe(registration => {
      this.country = registration.country
      this.name = registration.name
    })

    this.userStatsService.getUserLogins(this.user_id).subscribe(userLogins => {
      this.numberLogins = userLogins.length

      var date1 = null
      if(this.date === '') date1 = new Date("2010-05-23"); //thats last date in dataset
      else date1 = new Date(this.date)

      var date2 = new Date()
      for(let i = 0; i < userLogins.length; i++){
        date2 = new Date(userLogins[i].event_timestamp * 1000)
        if(date2.getTime() < date1.getTime()) break
      }
      if(date2.getTime() >= date1.getTime()) date2=date1

      
      var Difference_In_Time = date1.getTime() - date2.getTime(); 
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 

      this.daysSinceLastLogin = Math.round(Difference_In_Days)

    })

    this.userStatsService.getUserSessions(this.user_id).subscribe(userSessions => {
      if(this.date != ''){
        this.numberOfSessions = 0
        this.timeSpentInGame = 0
        var date1 = new Date(this.date)
        for(let i = 0; i < userSessions.length; i++){
          var logInTime = new Date(userSessions[i].logInTime*1000)
          var logOutTime = new Date(userSessions[i].logOutTime*1000)
          if(date1.getFullYear() == logInTime.getFullYear() && date1.getMonth() == logInTime.getMonth() && date1.getDate() == logInTime.getDate()){
            this.numberOfSessions++;

            this.timeSpentInGame += (Math.abs(logOutTime.getTime() - logInTime.getTime())/1000)  
          }
        }
      }
      else {
        this.timeSpentInGame = 0
        for(let i = 0; i < userSessions.length; i++){
          var logInTime = new Date(userSessions[i].logInTime*1000)
          var logOutTime = new Date(userSessions[i].logOutTime*1000)
          this.timeSpentInGame += (Math.abs(logOutTime.getTime() - logInTime.getTime())/1000)  
        }
        this.numberOfSessions = userSessions.length
      }
    })

  }

  isDateFormatValid(): boolean {
    var dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    return dateFormat.test(this.date);
  }
}
