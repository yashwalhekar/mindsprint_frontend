import React from 'react'

const ViewUsers = () => {
    const { data: users, isLoading, isError } = useGetAllUsersQuery();
    console.log("data", users);
    
  return (
    <div>ViewUsers</div>
  )
}

export default ViewUsers