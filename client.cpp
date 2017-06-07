#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>  
#include <string.h>
#include <sys/types.h>  
#include <sys/socket.h>  
#include <netinet/in.h>  
#include <arpa/inet.h>  

#define SERVER_IP "140.114.79.85"
#define PORT 12560
#define MAX_BUFF_SIZE 2048
#define UNKNOWN 9999;

int temp_bound  = 30;
int humid_bound = 50;
int temp_period[2]  = { 60*60*10, 60*60*8};
int humid_period[2] = { 60*60*12, 60*60*10};

int askServer(char *recv_buf, int plant_id){
	struct sockaddr_in addr;  
	socklen_t len;  
	int fd;

	char send_buf[MAX_BUFF_SIZE];
	int nbytes;

	/* create socket */  
	fd = socket(AF_INET, SOCK_STREAM, 0);  
	/* set socket */  
	addr.sin_family = AF_INET;  
	addr.sin_port = htons(PORT);  
	/* connect */
	inet_pton(AF_INET, SERVER_IP, &addr.sin_addr.s_addr);  

	connect(fd, (struct sockaddr *)&addr, sizeof(addr));

	// Send plant ID
	sprintf(send_buf, "%d", plant_id);
	write(fd, send_buf, strlen(send_buf));	

	// Recv module string
	nbytes = read(fd, recv_buf, MAX_BUFF_SIZE);
	printf("[Client Recv]> %s\n", recv_buf);

	// close connect
	close(fd);

	return nbytes;
}

void setModule(int plant_id){
	char buf[MAX_BUFF_SIZE];
	int n;
	n = askServer(buf, plant_id);

	// slice string
	char *token;
	int arr[10], i=0;
	token = strtok(buf, ",");
	while(token!=NULL){
		arr[i++] = atoi(token);
		token = strtok(NULL, ",");
	}

	temp_bound  = arr[0];
	humid_bound = arr[1];
	temp_period[0] = arr[2];
	temp_period[1] = arr[3];
	humid_period[0] = arr[4];
	humid_period[1] = arr[5];

	return ;
}

int main(int argc, char *argv[]){
	char buf[MAX_BUFF_SIZE];
	int nbytes;

	// Set Plant ID
	int plant_id=0;
	if(argc<2){
		printf("please enter the plant id.\n");
		return 0;
	}
	plant_id = atoi(argv[1]);
	printf("ID:%d\n", plant_id);	

	// Set Module
	setModule(plant_id);
	printf("[temp=%d](%d,%d)\n", temp_bound, temp_period[0], temp_period[1]);
	printf("[humid=%d](%d,%d)\n", humid_bound, humid_period[0], humid_period[1]);

	// Setting Counter
	float temp, humid; 
	int counter = 1;

	// Work loop
	while(1){
		// Get Temp/Humid
		// TODO
		temp = UNKNOWN;
		humid= UNKNOWN;

		// Base Period
		int base_temp_period  = (temp  > temp_bound)?  temp_period[0]:  temp_period[1];
		int base_humid_period = (humid > humid_bound)? humid_period[0]: humid_period[1];

		// check temp bound, change light (don't ask why)
		if(counter % base_temp_period == 0){
			if( ((counter / base_temp_period) % 2) == 1){
				// TODO: curtain up
				;
			}
			else{
				// TODO: curtain down
				;
			}
		}


		// check humid bound, sprinkle
		if(counter % base_humid_period == 0){
			// TODO: start sprinkle
		}
		else if(counter % base_humid_period == 3){
			// TODO: stop sprinkle
		}


		sleep(1);
		counter = (counter+1)%86400; // one day period
	}

	return 0;
}

