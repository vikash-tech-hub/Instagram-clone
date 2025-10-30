import { Dialog, DialogContent } from '@/components/ui/dialog'
import React from 'react'
const createposthandler=async(e)=>{
    e.preventDefault()
    try {
        
    } catch (error) {
        
    }
}
const Createpost = ({open,setOpen}) => {
  return (
    <Dialog open={open}>
        <DialogContent oninteractOutside={()=>setOpen(false)}>
            <form onSubmit={createposthandler}></form>
        </DialogContent>
    </Dialog>
  )
}

export default Createpost
