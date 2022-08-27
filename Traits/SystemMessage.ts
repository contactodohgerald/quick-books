
export const returnMessage = (keyoptions: any) => {
    const messages = {
        logout : 'You have successfully logged out and the token was successfully deleted',
        login : 'Login was successful',
        code_sent : 'Hi, a code has been sent. Please provide the code to continue',
        account_verified : 'Your account was successfully verified, please login to continue',
        registered : 'Your account was created successfully, please verify account to continue',
        returned_success : 'Data was successfully returned',
        returned_error : 'No Data was returned',
        created : 'You request was successfully created',
        updated : 'You request was successfully updated',
        deleted : 'You request was successfully deleted',
        declined : 'You request was successfully declined',
        general_error : 'An error occured, try again later',
        subscribed : 'Please subscribe to either of the plans to continue',
        agent_login : 'An agent is not allowed here. Please navigate to the agent portal to continue',
        banned : 'Your account has either been banned or suspended from using this platform. Please contact support for futher clarification',
    }
    return messages.registered;
}