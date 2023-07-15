import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../message.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: any[] = [];
  reply!: string;
  messageId: any;
  replyForm!: FormGroup;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder
    ) {}

  ngOnInit(): void {
    this.fetchMessages();
    this.replyForm = this.formBuilder.group({
      reply: ['']
    });
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
    const reply = this.replyForm.value.reply;
    const messageId = localStorage.getItem('messageId');
    if(userId && messageId){
    this.messageService.postMessage(
      userId,
      messageId,
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

  displayMessage(messages: any, messageId: any): void {
    this.selectedMessageContent = messages.content;
    this.selectedMessageHeader = messages.header;
    localStorage.setItem('messageId', messageId);
  }
}
