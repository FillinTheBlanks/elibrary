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
import { createBook, getBookAuthors, getBookCategory, updateBook, getBookSubjects, getBookClasses, getBookbyId } from '@/http/api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useLoginStore from '@/storage';
import SearchableDropdown from "@/components/ui/searchable-dropdown";
import CreateUpdateCategoryModal from './CreateUpdateCategoryModal';
import CreateUpdateAuthorModal from './CreateUpdateAuthorModal';


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
    .refine((file) => file === undefined || file.length <= 1, "Only one cover image allowed."),
  file: z.instanceof(FileList)
    .optional()
    .refine((file) => file === undefined || file.length <= 1, "Only one book PDF allowed."),
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
});

const CreateUpdateBook = () => {
  const { id } = useParams<{ id: string }>();
  const isUpdate = !!id && id !== '0';
  const user_id = useLoginStore((state) => state.id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  var today = new Date();
  const [classId,setClassId] = useState('0');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAuthorModal, setShowAuthorModal] = useState<boolean>(false);

   const { data:BookCategoryList, isLoading: isBookCategoryLoading, isError: isBookCategoryError } = useQuery({
      queryKey: ['book_category'],
      queryFn: getBookCategory,
      enabled: true,
	    refetchInterval: 5000,
      staleTime: 10000,
      networkMode: 'always',
    });

    const { data:AuthorList, isLoading: isAuthorLoading, isError: isAuthorError } = useQuery({
      queryKey: ['book_author'],
      queryFn: getBookAuthors,
      enabled: true,
	    refetchInterval: 6000,
      staleTime: 10000,
      networkMode: 'always',
    });

    const { data:ClassList, isLoading: isClassLoading, isError: isClassError } = useQuery({
      queryKey: ['book_class'],
      queryFn: getBookClasses,
      enabled: true,
	    refetchInterval: 7000,
      staleTime: 10000,
      networkMode: 'always',
    });

    // Fetch subjects based on selected class
    const { data: SubjectList } = useQuery({
      queryKey: ['book_subject', classId],
      queryFn: () => getBookSubjects(classId),
      enabled: !!classId && classId !== '0',
	    refetchInterval: 2000,
      networkMode: 'online',
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

  
  const { data: bookData, isLoading: isBookLoading, isError: isBookError } = useQuery({
    queryKey: ['book'],
    queryFn: () => getBookbyId(id!),
    enabled: isUpdate,
    refetchInterval: 5000,
    networkMode: 'always',
  });
  
  useEffect(() => {
    console.log(bookData);
    if (parseInt(id!) > 0 && isUpdate && bookData) {
      //console.log(bookData?.data[0].book_id.toString());
      form.reset({
        book_id: bookData.data[0].book_id.toString() ? id : id,
        name: bookData.data[0].name,
        book_category_id: bookData.data[0].book_category_id.toString(),
        description: bookData.data[0].description,
        createdBy: bookData.data[0].createdBy.toString(),
        status: bookData.data[0].status,
        author_id: bookData.data[0].author_id.toString(),
        isbn: bookData.data[0].isbn || '',
        price: bookData.data[0].price || '',
        edition: bookData.data[0].edition || '',
        
        fileUrl: bookData.data[0].fileUrl || '',
        class_id: bookData.data[0].class_id ? bookData.data[0].class_id.toString() : '0',
        quantity: bookData.data[0].quantity ? bookData.data[0].quantity.toString() : '1',
        subject_id: bookData.data[0].subject_id ? bookData.data[0].subject_id.toString() : '0',
        publisher_id: bookData.data[0].publisher_id ? bookData.data[0].publisher_id.toString() : '0',
        coverImageUrl: bookData.data[0].coverImageUrl || '',
        createdAt: bookData.data[0].createdAt,
      } as z.infer<typeof formSchema>);
    }
  }, [bookData, isUpdate, form, BookCategoryList, AuthorList]);

  useEffect(() => {
    
  })

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
      if (response.data.result === "UPDATED") {
        queryClient.invalidateQueries({ queryKey: ['books'] });
        navigate('/dashboard/books');
      }
    },
    onError: (error) => {
      console.error("Error updating book:", error.message);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formdata = new FormData();
    formdata.append('name', values.name);
    formdata.append('description', values.description);
    formdata.append('book_category_id', values.book_category_id);
    if (values.coverImage?.[0]) {
      formdata.append('coverImage', values.coverImage[0]);
    }
    if (values.file?.[0]) {
      formdata.append('file', values.file[0]);
    }
    formdata.append('book_id', values.book_id);
    formdata.append('createdBy', values.createdBy);
    formdata.append('createdAt', values.createdAt);
    formdata.append('status', values.status);
    formdata.append('author_id', values.author_id);
    formdata.append('isbn', values.isbn);
    formdata.append('price', values.price);
    formdata.append('edition', values.edition);
    formdata.append('fileUrl', values.fileUrl || '');
    formdata.append('class_id', values.class_id);
    formdata.append('quantity', values.quantity);
    formdata.append('subject_id', values.subject_id);
    formdata.append('publisher_id', values.publisher_id);
    formdata.append('coverImageUrl', values.coverImageUrl || '');

    //if (isUpdate) {
    //  updateMutation.mutateAsync(formdata);
    //} else {
      createMutation.mutateAsync(formdata);
    //}

    console.log(values);
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
    {showModal ? <div id="textlayer"><CreateUpdateCategoryModal modalShow={showModal} modalClose={() => setShowModal(false)} /></div>: null}
    {showAuthorModal ? <div id="textlayer"><CreateUpdateAuthorModal modalShow={showAuthorModal} modalClose={() => setShowAuthorModal(false)} /></div>: null}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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

              <Button type="submit" disabled={mutation.isPending}>
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
                          <FormLabel>Book Category </FormLabel><Button variant={'link'} className='h-[20px]' disabled={isBookCategoryLoading} onClick={() => {setShowModal(true);}}  > <CirclePlus size={20} /> </Button>{isBookCategoryLoading && <LoaderCircle className="animate-spin" />}
                          <FormControl>
                          <div className="flex gap-2 items-start">
                          <div className="flex-1">
                            <SearchableDropdown
                              dataList={BookCategoryList?.data}
                              disabled={isBookCategoryLoading}
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
                              onValueChange={(value) => {field.onChange(value); setClassId(value); console.log(value);}}
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
                      name='coverImage'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel id={field.name}>Cover Image</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept=".png, .jpg"
                              className="w-full"
                              {...coverImageRef}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='file'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel id={field.name}>Book PDF</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept=".pdf"
                              className="w-full"
                              {...fileRef}
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