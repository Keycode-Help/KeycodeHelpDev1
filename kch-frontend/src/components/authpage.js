import { User, Mail, Phone, LockKeyhole } from 'lucide-react'

const loginForm = [
    { 
        id: 'email', 
        label: 'Email', 
        type: 'email', 
        name:'email',
        placeholder: 'Email Address', 
        icon: Mail 
    },
    { 
        id: 'password', 
        label: 'Password', 
        type: 'password', 
        name: 'password',
        placeholder: '••••••••', 
        icon: LockKeyhole 
    }
]

const registerForm = [
    { 
        id: 'firstName', 
        label: 'First Name', 
        type: 'text', 
        name: 'fname', 
        placeholder: 'First Name', 
        icon: User
    },
    { 
        id: 'lastName', 
        label: 'Last Name', 
        type: 'text', 
        name: 'lname', 
        placeholder: 'Last Name', 
        icon: User
    },
    { 
        id: 'email', 
        label: 'Email', 
        type: 'email', 
        name: 'email', 
        placeholder: 'Email Address', 
        icon: Mail 
    },
    { 
        id: 'phone', 
        label: 'Phone', 
        type: 'tel', 
        name: 'phone', 
        placeholder: 'Phone Number', 
        icon: Phone 
    },
    { 
        id: 'password', 
        label: 'Password', 
        type: 'password', 
        name: 'password', 
        placeholder: '••••••••', 
        icon: LockKeyhole 
    }
]

export {
    loginForm,
    registerForm
}

