import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { createUpdateBookCategory, getBookCategorybyId } from "@/http/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from 'lucide-react';

interface IModalProps {
  onHideModal?: () => void
  modalShow: boolean
  modalClose: any
}

const CreateUpdateCategoryModal = ({modalShow, modalClose }: IModalProps): JSX.Element => {
  console.log(modalShow);
  const { id } = useParams<{ id: string }>();
  const isUpdate = !!id && id !== '0';
  //const mutation = isUpdate ? updateMutation : createUpdateMutation;
  
  const formSchema = z.object({
    book_category_id: z.string(),
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    description: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
  });



  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        book_category_id: '0',
        name: '',
        description:'',
      }
      });

    function onSubmit(values: z.infer<typeof formSchema>) {
      console.log(values);
      const formdata = new FormData();
      formdata.append('name', values.name);
      formdata.append('description', values.description);
      formdata.append('book_category_id', values.book_category_id);

      createUpdateMutation.mutateAsync(formdata);
    }
    
  const { data: bookCategoryData, isLoading: isBookCategoryLoading, isError: isBookCategoryError } = useQuery({
      queryKey: ['book'],
      queryFn: () => getBookCategorybyId(id!),
      enabled: isUpdate,
      refetchInterval: 5000,
      networkMode: 'always',
    });
    if (isBookCategoryLoading ) {
  
      return <div>Loading book category...</div>;
    }
  
    if (isBookCategoryError) {
     
      return <div>Error loading book category.</div>;
    }
      
  const createUpdateMutation = useMutation({
      mutationFn: createUpdateBookCategory,
      onSuccess: (response) => {
        if (response.data.result === "SAVED") {
          form.reset();
          modalClose();
          
        }
      },
      onError: (error) => {
        console.error("Error creating book category:", error.message);
      },
  });
  

  useEffect(() => {
      
      if (parseInt(id!) > 0 && isUpdate && bookCategoryData) {
        //console.log(bookData?.data[0].book_id.toString());
        form.reset({
          book_category_id: bookCategoryData.data[0].book_category_id.toString() ? id : id,
          name: bookCategoryData.data[0].name,
          description: bookCategoryData.data[0].description,
        })
      }
    });

    const title = isUpdate ? 'Edit Book Category' : 'Create New Book Category';

  return <> {

    <div
      className="modal">
      <button
        onClick={modalClose}
        className="modal-close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="modal-content">
        <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                      Fill out the form below to {isUpdate ? 'update' : 'create'} a new category.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='description'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={createUpdateMutation.isPending}>
                      {createUpdateMutation.isPending && <LoaderCircle className="animate-spin" />}
                      <span className="ml-2">Submit</span>
                    </Button>
                    </div>

                    </CardContent>
                  </Card>
                </form>
       </Form>
      </div>
    </div>
  }
  </>

}

export default CreateUpdateCategoryModal;