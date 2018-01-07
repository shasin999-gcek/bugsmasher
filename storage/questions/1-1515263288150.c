#include<stdio.h>
#include<stdlib.h>

struct polynomial {
  int coeff;
  int exp;
  struct polynomial *link;
} *p_head, *q_head, *r_head;

// func prototypes
struct polynomial *create_node(void);
void init_polynomial(struct polynomial **head_ref, char *name);
void display_polynomial(struct polynomial *head, char *name);
void insert_at_last(struct polynomial *head, struct polynomial *new_node); 
void delete_polynomial(struct polynomial **head_ref);
void add_two_polynomial(void);

void main() {
  init_polynomial(&p_head, "P");
  init_polynomial(&q_head, "Q");

  add_two_polynomial();
   
  // before adding
  display_polynomial(p_head, "P");
  display_polynomial(q_head, "Q");
  display_polynomial(r_head, "Result");
  
  delete_polynomial(&p_head);
  delete_polynomial(&q_head);
  delete_polynomial(&r_head);
}

/* func definitions */

//________________________________________________________________________________________
void add_two_polynomial(void) {
  struct polynomial *r_ptr, *p_ptr, *q_ptr, *new;

  
  // init resultant polynomial
  r_head = create_node();
  r_head->coeff = 0;
  r_head->exp = 0;
  r_head->link = NULL;

   
  // points to Head Node of Resultant polynomial
  r_ptr = r_head; 

  // init temporary pointers for traversing P and Q polynomials
  p_ptr = p_head->link;
  q_ptr = q_head->link;

  while(p_ptr != NULL && q_ptr != NULL) {
	// create the new node
	new = create_node();
	
    if(p_ptr->exp == q_ptr->exp) {
     
      new->coeff = p_ptr->coeff + q_ptr->coeff;
      new->exp = p_ptr->exp;
      
      // move both to next node
      p_ptr = p_ptr->link;
      q_ptr = q_ptr->link;
    
    } else if(p_ptr->exp > q_ptr->exp) {
		
      new->coeff = p_ptr->coeff;
      new->exp = p_ptr->exp;
      p_ptr = p_ptr->link;
      
    } else if(p_ptr->exp < q_ptr->exp){
		
      new->coeff = q_ptr->coeff;
      new->exp = q_ptr->exp;
      q_ptr = q_ptr->link;
  
	}
	
	 // move r_ptr to new node
	  new->link = NULL;
      r_ptr->link = new;
      r_ptr = new;   
      
  }
  
  while(p_ptr != NULL) {
	new = create_node();
	new->coeff = p_ptr->coeff;
    new->exp = p_ptr->exp;
    new->link = NULL;
    
    // change pointers
	r_ptr->link = new;
	r_ptr = new;
		 
	// move to next node
	 p_ptr = p_ptr->link;
  }
  
  while(q_ptr != NULL) {
	new = create_node();
	new->coeff = q_ptr->coeff;
    new->exp = q_ptr->exp;
    new->link = NULL;
    
    // change pointers
	r_ptr->link = new;
	r_ptr = new;
		 
	// move to next node
	 q_ptr = q_ptr->link;
  }

}

//_________________________________________________________________________________________
struct polynomial *create_node(void) {
  struct polynomial *node = (struct polynomial *) malloc(sizeof(struct polynomial));
  if(node == NULL) {
    printf("\nInsufficient Memmory Space");
    exit(0);
  }

  // otherwise return address
  return node;
}

//___________________________________________________________________________________________

void init_polynomial(struct polynomial **head_ref, char *name) {
  // first create a head node which coeff contains no. of terms in this
  // polynomial
  (*head_ref) = create_node();
  printf("\nEnter No. Of Terms of %s=> ", name);
  scanf("%d", &(*head_ref) -> coeff);
  (*head_ref)->exp = 0;
  (*head_ref)->link = NULL;

  int count = 0;
  struct polynomial *ptr = NULL;

  while(count < (*head_ref)->coeff) {
    ptr = create_node();
    printf("\n______________Enter Polynomial Details_________");
    printf("\nEnter Coefficient oF %s:%d => ", name, count + 1);
    scanf("%d", &ptr->coeff);
    printf("\nEnter Exponential of %s:%d => ", name, count + 1);
    scanf("%d", &ptr->exp);
    ptr->link = NULL;
    insert_at_last(*head_ref, ptr);
    count++;
  }
  

}

//_______________________________________________________________________________________________
void insert_at_last(struct polynomial *head, struct polynomial *new_node) {
  struct polynomial *tmp = head;
  while(tmp->link != NULL) {
    tmp = tmp->link;
  }

  tmp->link = new_node;
}

//________________________________________________________________________________________________
void display_polynomial(struct polynomial *head, char *name) {
  struct polynomial *tmp = head->link;

  printf("\n%s: ", name);
  while(tmp != NULL) {
    if(tmp->link != NULL) {
      printf("%dx^%d + ", tmp->coeff, tmp->exp);
    } else {
      printf("%dx^%d", tmp->coeff, tmp->exp);
    }  

    tmp = tmp->link;
  }

  printf("\n");
}

// __________________________________________________________________________________________________
void delete_polynomial(struct polynomial **head_ref) {
  struct polynomial *tmp = (*head_ref);
  while((*head_ref) != NULL) {
    (*head_ref) = (*head_ref)->link;
    free(tmp);
    tmp = (*head_ref);
  }
}

//______________________________________________________________________________________
