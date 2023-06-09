import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: any[] = [];
  reply: any;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.fetchMessages();
    this.reply= '';
  }

  fetchMessages(): void {
    const receiverId = localStorage.getItem("uuid")?.toString(); // Replace with the actual receiver's ID
    this.messageService.getMessagesByReceiverId(receiverId).subscribe(
      (response) => {
        console.log(response)
        this.messages = response.reverse();
      },
      (error) => {
        console.log('Error fetching messages:', error);
      }
    );
  }

  // postMessage(): void {
  //   const newMessage = {
  //     content: 'New message content',
  //     sender: 'sender-id',
  //     receiver: 'receiver-id',
  //     createdAt: new Date()
  //   };

  //   this.messageService.postMessage(newMessage).subscribe(
  //     (response) => {
  //       console.log('Message posted successfully:', response);
  //     },
  //     (error) => {
  //       console.log('Error posting message:', error);
  //     }
  //   );
  // }
  sendReply() {
    const userId = localStorage.getItem('uuid')?.toString()
    const reply = this.reply
    if(userId){
    this.messageService.postMessage(
      userId,
      reply
    ).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }
 }

  selectedMessageContent: string = '';
  selectedMessageHeader: string = '';

  displayMessage(messages: any): void {
    this.selectedMessageContent = messages.content;
    this.selectedMessageHeader = messages.header;
  }
}
