import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'src/app/message.service';

@Component({
  selector: 'app-admin-messages',
  templateUrl: './admin-messages.component.html',
  styleUrls: ['./admin-messages.component.css']
})
export class AdminMessagesComponent {
  messages: any[] = [];
  reply!: string;
  messageId: any;
  replyForm!: FormGroup;
  replies!: any[];

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

  fetchReplies() {
    this.messageService.fetchReplies().subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error('Error fetching replies:', error);
      }
    );
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

