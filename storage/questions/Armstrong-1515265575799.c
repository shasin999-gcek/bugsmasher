    #include<stdio.h>
    #include<stdlib.h>

    #define M(head) printf("\n[*] Head is pointing to %p\n", head)

    #define TRUE 1
    #define FALSE 0


    struct node {
        int data;
        struct node *next;
    };

    /* function prototypes */
    void delete_first(struct node **head_ref);
    void delete_last(struct node **head_ref);
    void delete_node(struct node **head_ref, int key);
    void display_linked_list(struct node *head);
    void free_linked_list(struct node **head_ref);
    int is_empty(struct node *head);
    void push(struct node **head_ref, int new_data);
    void append(struct node **head_ref, int new_data);
    void insert_after(struct node *previous_node, int new_data);
    void create(struct node **head_ref);
    struct node* search_node(struct node **head_ref, int key);
    void show_menu();

    int main(void) {
      struct node *head = NULL;
      int key = 0, new_data = 0;

      struct node *previous_node = NULL;

      int option = 0;
      char ch;

      // show the menu and ask for option to select
      show_menu();
        
      do {
        printf("\n[*] Enter your option => ");  
        scanf("%d", &option);

        switch(option) {
          case 1:
            create(&head);
            break;

          case 2:
            display_linked_list(head);
            break;

          case 3:
            printf("Enter new data => ");
            scanf("%d", &new_data);

            push(&head, new_data);
            display_linked_list(head);
            break;

          case 4:
            printf("Enter new data => ");
            scanf("%d", &new_data);

            append(&head, new_data);

            display_linked_list(head);

            break;

          case 5:
              printf("\nEnter key => ");
              scanf("%d", &key);

              // returns address of current matched node(we will insert new node
              // after this node)
              previous_node = search_node(&head, key);

              printf("\nEnter the new data => ");
              scanf("%d", &new_data);

              insert_after(previous_node, new_data);

              display_linked_list(head);

              break;		

          case 6:
            delete_first(&head);

            display_linked_list(head);
            break;

          case 7: 
            delete_last(&head);

            display_linked_list(head);
            break;

          case 8:
            printf("\nEnter key => ");
                    scanf("%d", &key);

            delete_node(&head, key);

            display_linked_list(head);
            break; 

          case 9:
            printf("\nExiting.......\n");
            free_linked_list(&head);
            exit(0);

          default:
            printf("\nInvalid Option!! Try Again....");  
        }

//        printf("\n[*] Press any key and [Enter] to continue => ");
//        scanf(" %c", &ch);

        } while(option != 9);

    }

    void show_menu() {
    //  system("clear");
      printf("\n_____________________________MENU_______________________________");
      printf("\n1. Create\n2. Display\n3. Insert at beginning");
      printf("\n4. Insert at End\n5. Insert after a data");
      printf("\n6. Delete the first Node\n7. Delete the last node\n8. Delete a perticular node");
      printf("\n9. Exit");
     // scanf("%d", option);
    }


    void create(struct node **head) {

      if(*head != NULL) {
        printf("\n[-] Cannot create new linked list already a list exists !!");
        return;
      }


        struct node *tmp = NULL, *next = NULL;

        // to strore confirm letter
        char ch;

        tmp = (struct node*) malloc(sizeof(struct node));
      if(tmp == NULL) {
        printf("Insufficient memmory !!");
        return;
      }

        printf("\nEnter the data to first node => ");
        scanf("%d", &tmp->data);

        (*head) = tmp;

        do {
            next = (struct node*) malloc(sizeof(struct node));

            if(next == NULL) {
                printf("Overflow\n");
            }

            printf("\nEnter the data to next node => : ");
            scanf("%d", &next->data);

            tmp->next = next;
            tmp = next;

            printf("[+] Do you wish to add more nodes to the linked list (Y/N): ");
          scanf(" %c", &ch);

        } while(ch == 'y' || ch == 'Y');

        tmp->next = NULL;

    }

    void display_linked_list(struct node *head) {
      if(!is_empty(head)) {
        struct node *tmp = head;

        // print linked list
        printf("\n#######################################################\n\n");
        printf("HEAD ==> ");
          while(tmp != NULL) {
              printf("%d ==> ", tmp->data);
              tmp = tmp->next;
          } 
        printf("NULL\n\n");
        printf("########################################################\n");

      }


        printf("\n");
    }

    void free_linked_list(struct node **head_ref) {
      struct node *tmp;

        while((*head_ref) != NULL) {
          tmp = (*head_ref);
          (*head_ref) = (*head_ref) -> next;
            free(tmp);
        }

    }

    void push(struct node **head_ref, int new_data) {

      // create the new node
      struct node *new_node = (struct node*) malloc(sizeof(struct node));

      if(new_node == NULL) {
        printf("\nOverflow!!");
        return;
      }

      //add new data to the new_node
      new_node->data = new_data;

      new_node->next = (*head_ref);
      (*head_ref) = new_node;

    }

    void append(struct node **head_ref, int new_data) {
      // temporary node pointer for traversing the linked list
      struct node *tmp = (*head_ref); 

      // create the new node;
      struct node *new_node = (struct node*) malloc(sizeof(struct node));


      if(new_node == NULL) {
        printf("\n[-] Overflow");
        return;
      }

      //add the data to the new_node
      new_node->data = new_data;

      // traverse through the linked list until it reaches to the last node
      while(tmp->next != NULL) 
        tmp = tmp->next;

      tmp->next = new_node;
      new_node->next = NULL;

    }

    struct node* search_node(struct node **head_ref, int data) {
      if(!is_empty(*head_ref)) {

        struct node *tmp = (*head_ref);

        while(tmp != NULL) {
          if(tmp->data == data) {
            return tmp;
          }
          tmp = tmp->next;
        }

        // return null if data doesn't exist in the list
        printf("[-] Data you searched for doesn't exist");
        return NULL; 
      }
    }

    void insert_after(struct node *previous_node, int new_data) {
      if(previous_node == NULL) {
        printf("\n[-] Error: previous_node pointer is NULL");
        return;
      }
      // create new node
      struct node *new_node = (struct node*) malloc(sizeof(struct node));

      if(new_node == NULL) {
        printf("\n[-] Overflow..");
        return;
      }

      // add new data
      new_node->data = new_data;

      // change pointers
      new_node->next = previous_node->next;
      previous_node->next = new_node;

    }


    void delete_first(struct node **head) {

      if(!is_empty(*head)) {

        struct node *tmp = (*head);
        (*head) = (*head)->next;
        free(tmp);

      }

    }

    void delete_last(struct node **head) {
      if(!is_empty(*head)) {

        if((*head)->next == NULL) {
          delete_first(head);
          return;
        }

        struct node *tmp = (*head);
        struct node *previous = NULL; // points to last node

        while(tmp->next != NULL) {
          previous = tmp;
          tmp = tmp->next;
        }

        previous->next = NULL;
        free(tmp);
      }
    }

    void delete_node(struct node **head, int key) {
      if(!is_empty(*head)) { 

        struct node *tmp = (*head);
        if(tmp->data == key || tmp->next == NULL) {
          delete_first(head);
          return;
        }

        struct node *previous = NULL;

        while(tmp->next != NULL && tmp->data != key) {
          previous = tmp;
          tmp = tmp->next;
        }

        previous->next = tmp->next;
        free(tmp);

      }
    }

    int is_empty(struct node *head) {
      if(head == NULL) {
        printf("\n[-] Linked list is empty");
        return TRUE;
      } else {
        return FALSE;
      }
    }




