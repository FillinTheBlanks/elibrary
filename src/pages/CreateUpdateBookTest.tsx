import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CirclePlus, CircleX, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBook, getBookAuthors, getBookCategory, updateBook, getBookSubjects, getBookClasses, getBookbyId, getBookStatus } from '@/http/api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useLoginStore from '@/storage';
import SearchableDropdown from "@/components/ui/searchable-dropdown";
import CreateUpdateCategoryModal from './CreateUpdateCategoryModal';
import CreateUpdateAuthorModal from './CreateUpdateAuthorModal';
import { Book } from '@/types';




const CreateUpdateBook = () => {

  
  const user_id = useLoginStore((state) => state.id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  var today = new Date();
 
  const [classId,setClassId] = useState('0');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [closeCategoryModal, setCloseCategoryModal] = useState<boolean>(false);
  const [showAuthorModal, setShowAuthorModal] = useState<boolean>(false);
  const [closeAuthorModal, setCloseAuthorModal] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const isUpdate = !!id && id !== '0';

const formSchema = z.object({
  book_id: z.string(),
  name: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  book_category_id: z.string().min(1, {
    message: "Book Category is required.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  coverImage: z.instanceof(FileList)
    .optional()
    .superRefine((files, ctx) => {
      // Only validate for new entries
      if (!isUpdate) {
        if (!files || files.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Cover image is required for new books",
          });
        }
      }
      if (files && files.length > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Only one cover image allowed",
        });
      }
    }),
  file: z.instanceof(FileList)
    .optional()
    .superRefine((files, ctx) => {
      // Only validate for new entries
      if (!isUpdate) {
        if (!files || files.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "PDF file is required for new books",
          });
        }
      }
      if (files && files.length > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Only one PDF file allowed",
        });
      }
    }),
  createdBy: z.string(),
  status: z.string(),
  author_id: z.string().min(1, {
    message: "Book Author is required.",
  }),
  class_id: z.string().min(1, {
    message: "Class is required.",
  }),
  subject_id: z.string().min(1, {
    message: "Subject is required.",
  }),
  isbn: z.string(),
  price: z.string(),
  edition: z.string(),
  fileUrl: z.string().optional(),
  quantity: z.string(),
  publisher_id: z.string(),
  coverImageUrl: z.string().optional(),
  createdAt: z.string(),
  timestamp: z.string(),
});

   const { data:BookCategoryList, isLoading: isBookCategoryLoading, isError: isBookCategoryError, refetch:refetchCategory} = useQuery({
     queryKey: ['book_category'],
     queryFn: getBookCategory,
     enabled: true,
     refetchOnWindowFocus: false,
	   //refetchInterval: 15001,
     
     //staleTime: 10000,
     networkMode: 'always',
   });


    const { data:AuthorList, isLoading: isAuthorLoading, isError: isAuthorError, refetch:refetchAuthor } = useQuery({
      queryKey: ['book_author'],
      queryFn: getBookAuthors,
      enabled: true,
      refetchOnWindowFocus: false,
	    //refetchInterval: 15002,
     
      //staleTime: 10000,
      networkMode: 'always',
    });

    const { data:ClassList, isLoading: isClassLoading, isError: isClassError,refetch:refetchClass } = useQuery({
      queryKey: ['book_class'],
      queryFn: getBookClasses,
      enabled: true,
      refetchOnWindowFocus: false,
	    //refetchInterval: 15003,
      //refetchOnReconnect: true,
      //staleTime: 10000,
      networkMode: 'always',
    });

    // Fetch subjects based on selected class
    const { data: SubjectList } = useQuery({
      queryKey: ['book_subject', classId],
      queryFn: () => getBookSubjects(classId),
      enabled: !!classId && classId !== '0',
      //refetchOnReconnect: true,
	    //refetchInterval: 2000,
      networkMode: 'always',
    });

    const { data:StatusList,refetch:refetchStatus } = useQuery({
      queryKey: ['book_status'],
      queryFn: getBookStatus,
      enabled: true,
	    //refetchInterval: 15004,
      refetchOnReconnect: true,
      //staleTime: 10000,
      networkMode: 'always',
    });

    const { data: bookData, isLoading: isBookLoading, isError: isBookError,refetch:refetchBook } = useQuery({
      queryKey: ['book'],
      queryFn: () => getBookbyId(id!),
      enabled: isUpdate,
      networkMode: 'always',
    });

    
  

  const form = useForm<z.infer<typeof formSchema>>({
   
    resolver: zodResolver(formSchema),
    defaultValues: {
      book_id: '0',
      name: '',
      book_category_id: '0',
      description: '',
      createdBy: user_id.toString(),
      status: 'ACTIVE',
      author_id: '0',
      isbn: '',
      price: '',
      edition: '',
      fileUrl: '',
      class_id: '0',
      quantity: '1',
      subject_id: '0',
      publisher_id: '0',
      coverImageUrl: '',
      createdAt: `${today.getFullYear().toString()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`,
    },
  });

  const coverImageRef = form.register('coverImage');
  const fileRef = form.register('file');

  if (closeCategoryModal) refetchCategory();
  if(closeAuthorModal ) refetchAuthor();
  
  useEffect(() => {
    
    if(BookCategoryList?.data.result == "NO DATA" || closeCategoryModal) refetchCategory(); setCloseCategoryModal(false);
    if(AuthorList?.data.result == "NO DATA" || closeAuthorModal) refetchAuthor(); setCloseAuthorModal(false);
    if(ClassList?.data.result == "NO DATA") refetchClass();
    if(StatusList?.data.result == "NO DATA") refetchStatus();
    if(parseInt(id!) > 0 ) refetchBook();

    var items = Array.isArray(bookData?.data) ? bookData?.data : [];

    if (parseInt(id!) > 0 && isUpdate && items.length > 0 ) {
      
      items.map((book:Book) => {
        setClassId(book.class_id.toString());
      form.reset({
        book_id: book.book_id.toString() ? id : id,
        name: book.name,
        book_category_id: book.book_category_id.toString(),
        description: book.description,
        createdBy: book.createdBy.toString(),
        status: book.status,
        author_id: book.author_id.toString(),
        isbn: book.isbn || '',
        price: book.price || '',
        edition: book.edition || '',
        fileUrl: book.fileUrl || '',
        class_id: book.class_id ? book.class_id.toString() : '0',
        quantity: book.quantity ? book.quantity.toString() : '1',
        subject_id: book.subject_id ? book.subject_id.toString() : '0',
        publisher_id: book.publisher_id ? book.publisher_id.toString() : '0',
        coverImageUrl: book.coverImageUrl || '',
        createdAt: book.createdAt,
      } as z.infer<typeof formSchema>);
    })
    }
  }, [isUpdate, form, BookCategoryList, AuthorList,ClassList,SubjectList]);


  const createMutation = useMutation({
    mutationFn: createBook,
    onSuccess: (response) => {
      if (response.data.result === "SAVED") {
        form.reset();
        queryClient.invalidateQueries({ queryKey: ['books'] });
        navigate('/dashboard/books');
      }
    },
    onError: (error) => {
      console.error("Error creating book:", error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateBook,
    onSuccess: (response) => {
      if (response.data.result === "SAVED") {
        queryClient.invalidateQueries({ queryKey: ['books'] });
        navigate('/dashboard/books');
      }
    },
    onError: (error) => {
      console.error("Error updating book:", error.message);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Submit button clicked');
    try {
    
    
    //const formdata = new FormData();
    //formdata.append('name', values.name);
    //formdata.append('description', values.description);
    //formdata.append('book_category_id', values.book_category_id);
    //if (values.coverImage?.[0]) {
    //  formdata.append('coverImage', values.coverImage[0]);
    //}
    //if (values.file?.[0]) {
    //  formdata.append('file', values.file[0]);
    //}
    //formdata.append('book_id', values.book_id);
    //formdata.append('createdBy', values.createdBy);
    //formdata.append('createdAt', values.createdAt);
    //formdata.append('timestamp', values.timestamp);
    //formdata.append('status', values.status);
    //formdata.append('author_id', values.author_id);
    //formdata.append('isbn', values.isbn);
    //formdata.append('price', values.price);
    //formdata.append('edition', values.edition);
    //formdata.append('fileUrl', values.fileUrl || '');
    //formdata.append('class_id', values.class_id);
    //formdata.append('quantity', values.quantity);
    //formdata.append('subject_id', values.subject_id);
    //formdata.append('publisher_id', values.publisher_id);
    //formdata.append('coverImageUrl', values.coverImageUrl || '');
//
    //if (isUpdate) {
    //  await updateMutation.mutateAsync(formdata);
    //} else {
    // await createMutation.mutateAsync(formdata);
    //}

    console.log(values);
  } catch (error) {
    console.error("Submission failed:", error);
  }
  }

  const mutation = isUpdate ? updateMutation : createMutation;
  const title = isUpdate ? 'Edit Book' : 'Create a new book';
  const breadcrumbPage = isUpdate ? 'Edit' : 'Create';

  if (isBookLoading && isUpdate) {
    return <div>Loading book details...</div>;
  }

  if (isBookError && isUpdate) {
    return <div>Error loading book details.</div>;
  }

  if (isBookCategoryLoading ) {
    
    return <div>Loading book category...</div>;
  }
  if (isBookCategoryError) {
    navigate('/dashboard/books');
    return <div>Error loading book category.</div>;
  }

  if (isAuthorLoading ) {
    
    return <div>Loading book author...</div>;
  }

  if (isAuthorError) {
    navigate('/dashboard/books');
    return <div>Error loading book author.</div>;
  }

  if (isClassLoading ) {
   
    return <div>Loading book class...</div>;
  }

  if (isClassError) {
    navigate('/dashboard/books');
    return <div>Error loading book class.</div>;
  }


  return (
    <>
    {showModal ? <div id="textlayer"><CreateUpdateCategoryModal modalShow={showModal} modalClose={() => {setShowModal(false); setCloseCategoryModal(true)}} /></div>: null}
    {showAuthorModal ? <div id="textlayer"><CreateUpdateAuthorModal modalShow={showAuthorModal} modalClose={() => {setShowAuthorModal(false); setCloseAuthorModal(true)}} /></div>: null}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} >
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/books">Books</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumbPage}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center gap-4">
              <Link to='/dashboard/books'>
                <Button variant={'outline'} >
                  <CircleX size={20} />
                  <span className="ml-2">Cancel</span>
                </Button>
              </Link>

              <Button type="submit" 
                  disabled={mutation.isPending}
                  className={Object.keys(form.formState.errors).length > 0 ? 
                    "border-red-500" : ""}>
                  {mutation.isPending && <LoaderCircle className="animate-spin" />}
                  <span className="ml-2">Submit</span>
              </Button>
            </div>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>
                Fill out the form below to {isUpdate ? 'update' : 'create'} a new book.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Book Details</CardTitle>
                  <CardDescription>
                    Fill out the Input Fields Given below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
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
                      name="book_category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Book Category </FormLabel><Button variant={'link'} className='h-[20px]' onClick={() => {setShowModal(true);}} > {isBookCategoryLoading ? <LoaderCircle className="animate-spin" /> : <CirclePlus size={20} />}</Button>
                          <FormControl>
                          <div className="flex gap-2 items-start">
                          <div className="flex-1">
                            <SearchableDropdown
                              dataList={BookCategoryList?.data}
                              //disabled={isBookCategoryLoading}
                              key={field.name}
                              ref={field.ref}
                              label='Category'
                              placeholder='Select a Category'
                              searchPlaceholder='Search Category'
                              keysToMatch={['name']}
                              valueKey="book_category_id"
                              labelKey="name"
                              forwardedValue={field.value}
                              onValueChange={(value) => field.onChange(value)}
                              
                            />
                            </div></div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                        
                      )}
                      
                    />

                    <FormField
                      control={form.control}
                      name="author_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Book Author</FormLabel><Button variant={'link'} className='h-[20px]' disabled={isAuthorLoading} onClick={() => {setShowAuthorModal(true);}}  > {isAuthorLoading ? <LoaderCircle className="animate-spin" /> : <CirclePlus size={20} />} </Button>
                          <FormControl>
                          <div className="flex gap-2 items-start">
                          <div className="flex-1">
                            <SearchableDropdown
                              dataList={AuthorList?.data}
                              disabled={isAuthorLoading}
                              key={field.name}
                              ref={field.ref}
                              label='Authors'
                              placeholder='Select an Author'
                              searchPlaceholder='Search Author'
                              keysToMatch={['name']}
                              valueKey="author_id"
                              labelKey="name"
                              forwardedValue={field.value}
                              onValueChange={(value) => field.onChange(value)}
                              
                            />
                            </div></div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <FormField
                      control={form.control}
                      name="class_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <FormControl>
                            <SearchableDropdown
                              dataList={ClassList?.data}
                              key={field.name}
                              ref={field.ref}
                              disabled={isClassLoading}
                              label='Classes'
                              placeholder='Select a Class'
                              searchPlaceholder='Search Class'
                              keysToMatch={['name']}
                              valueKey="class_id"
                              labelKey="name"
                              forwardedValue={field.value}
                              onValueChange={(value) => {field.onChange(value); setClassId(value);}}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <FormField
                      control={form.control}
                      name="subject_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <SearchableDropdown
                              dataList={SubjectList?.data}
                              
                              key={field.name}
                              ref={field.ref}
                              label='Subjects'
                              placeholder='Select a Subject'
                              searchPlaceholder='Search Subject'
                              keysToMatch={['name']}
                              valueKey="subject_id"
                              labelKey="name"
                              forwardedValue={field.value}
                              onValueChange={(value) => field.onChange(value)}
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
                            <Textarea
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <FormField
                      control={form.control}
                      name="coverImage"
                      render={({ field }) => {
                        const fileUrl = form.watch('coverImageUrl');
                        return (
                          <FormItem>
                            <FormLabel id={field.name}>Cover Image</FormLabel>
                            <FormControl>
                              {isUpdate && fileUrl ? (
                                <div className="flex items-center gap-2">
                                  <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                  >
                                    {fileUrl.split('/').pop()}
                                  </a>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      form.setValue('coverImageUrl', '');
                                      form.resetField('coverImage');
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              ) : (
                            <Input
                              type="file"
                              accept=".png, .jpg"
                              className="w-full"
                              {...coverImageRef}
                            />
                          )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                    />

                    <FormField
                      control={form.control}
                      name="file"
                      render={({ field }) => {
                        const fileUrl = form.watch('fileUrl');
                        return (
                          <FormItem>
                            <FormLabel id={field.name}>Book PDF</FormLabel>
                            <FormControl>
                              {isUpdate && fileUrl ? (
                                <div className="flex items-center gap-2">
                                  <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                  >
                                    {fileUrl.split('/').pop()}
                                  </a>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      form.setValue('fileUrl', '');
                                      form.resetField('file');
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              ) : (
                                <Input
                                  type="file"
                                  accept=".pdf"
                                  className="w-full"
                                  {...fileRef}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                      
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <SearchableDropdown
                              dataList={StatusList?.data}
                              key={field.name}
                              ref={field.ref}
                              label='Status'
                              placeholder='Select Status'
                              searchPlaceholder='Search Status'
                              keysToMatch={['name']}
                              valueKey="name"
                              labelKey="name"
                              forwardedValue={field.value}
                              onValueChange={(value) => field.onChange(value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </form>
      </Form>
                    
    </>
  );
};

export default CreateUpdateBook;