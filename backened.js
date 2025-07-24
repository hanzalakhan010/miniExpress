const userList = [
    {
        id: 1,
        fullName: "Alice Johnson",
        fathersName: "Robert Johnson",
        dateOfBirth: "1990-05-12",
        cnicOrBForm: "12345-6789012-3",
        email: "alice.johnson@example.com",
        phoneNumber: "123-456-7890",
        password: "Password123",
        role: "admin",
        isActive: true,
        createdAt: "2024-01-10T08:45:00Z",
        rollNo: "A001"
    },
    {
        id: 2,
        fullName: "Bob Smith",
        fathersName: "James Smith",
        dateOfBirth: "1985-07-22",
        cnicOrBForm: "23456-7890123-4",
        email: "bob.smith@example.com",
        phoneNumber: "234-567-8901",
        password: "Secret456",
        role: "user",
        isActive: true,
        createdAt: "2024-02-15T12:00:00Z",
        rollNo: "B002"
    },
    {
        id: 3,
        fullName: "Charlie Lee",
        fathersName: "David Lee",
        dateOfBirth: "1992-03-15",
        cnicOrBForm: "34567-8901234-5",
        email: "charlie.lee@example.com",
        phoneNumber: "345-678-9012",
        password: "Charlie789",
        role: "user",
        isActive: false,
        createdAt: "2024-03-20T15:30:00Z",
        rollNo: "C003"
    },
    {
        id: 4,
        fullName: "Diana Ross",
        fathersName: "Edward Ross",
        dateOfBirth: "1988-11-30",
        cnicOrBForm: "45678-9012345-6",
        email: "diana.ross@example.com",
        phoneNumber: "456-789-0123",
        password: "Diana321",
        role: "moderator",
        isActive: true,
        createdAt: "2024-04-05T09:15:00Z",
        rollNo: "D004"
    },
    {
        id: 5,
        fullName: "Eric Miller",
        fathersName: "Frank Miller",
        dateOfBirth: "1995-06-18",
        cnicOrBForm: "56789-0123456-7",
        email: "eric.miller@example.com",
        phoneNumber: "567-890-1234",
        password: "Eric654",
        role: "user",
        isActive: true,
        createdAt: "2024-05-25T14:00:00Z",
        rollNo: "E005"
    }
];

export function auth(userCred) {
    if (!userCred?.email || !userCred?.password) return false
    const user = userList.find((user_) => user_.email === userCred.email && user_.password === userCred.password)
    if (!user) return false
    return user
}