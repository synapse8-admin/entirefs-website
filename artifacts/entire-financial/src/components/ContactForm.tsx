import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

const formSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters.").max(128),
  email: z.string().trim().email("Please enter a valid email address.").max(254),
  phone: z.string().trim().min(8, "Please enter a valid phone number.").max(30).regex(/^[+\d(). -]+$/, "Please enter a valid phone number."),
  enquiryType: z.enum(["initial-consultation", "superannuation", "retirement", "wealth", "other"], { errorMap: () => ({ message: "Please select an enquiry type." }) }),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(5000),
  preferredContact: z.enum(["email", "phone"], {
    required_error: "Please select a preferred contact method.",
  }),
  bestTime: z.enum(["morning", "afternoon", "late", "anytime"], { errorMap: () => ({ message: "Please select the best time to contact." }) }),
  website: z.string().default(""),
});

export function ContactForm() {
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const inFlight = useRef<AbortController | null>(null);
  const endpoint = `${import.meta.env.BASE_URL}contact.php`;
  useEffect(() => () => inFlight.current?.abort(), []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      message: "",
      website: "",
    },
  });
  const { isSubmitting, isSubmitSuccessful } = form.formState;
  // Reset after handleSubmit has finished updating its validation state.
  useEffect(() => {
    if (isSubmitSuccessful && result?.ok) form.reset();
  }, [isSubmitSuccessful, result, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (inFlight.current) return;
    const controller = new AbortController();
    inFlight.current = controller;
    const timer = setTimeout(() => controller.abort(), 30000);
    setResult(null);
    try {
      const response = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values), signal: controller.signal, credentials: "omit",
      });
      const data = await response.json();
      if (!response.ok || data.success !== true) throw new Error("Enquiry was not accepted.");
      setResult({ ok: true, message: "Thank you for contacting us. We will be in touch shortly." });
    } catch {
      setResult({ ok: false, message: "Your message could not be sent. Please try again, or phone 0421 833 372 or email bevan@entirefs.com.au. Your entries have been kept." });
    } finally {
      clearTimeout(timer);
      inFlight.current = null;
    }
  }

  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl border border-muted/50">
      <h2 className="font-sans text-2xl font-bold text-secondary mb-6">Send us a message</h2>
      <p id="required-fields" className="text-sm text-foreground/70 mb-4">All fields are required.</p>
      
      <Form {...form}>
        <form noValidate aria-describedby="required-fields" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div hidden aria-hidden="true">
            <label htmlFor="contact-website">Leave this field empty</label>
            <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...form.register("website")} />
          </div>
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input required autoComplete="name" maxLength={128} placeholder="John Doe" className="bg-muted/10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input required autoComplete="email" maxLength={254} placeholder="john@example.com" type="email" className="bg-muted/10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input required autoComplete="tel" maxLength={30} placeholder="0400 000 000" type="tel" className="bg-muted/10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="enquiryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enquiry Type</FormLabel>
                <Select
                  // Radix's hidden control emits "" on reset; it is not a user-selectable option.
                  onValueChange={(value) => { if (value) field.onChange(value); }}
                  value={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger aria-required="true" className="bg-muted/10">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="initial-consultation">Initial Consultation</SelectItem>
                    <SelectItem value="superannuation">Superannuation / SMSF</SelectItem>
                    <SelectItem value="retirement">Retirement Planning</SelectItem>
                    <SelectItem value="wealth">Wealth Protection / Insurance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea 
                    required maxLength={5000}
                    placeholder="How can we help you today?" 
                    className="min-h-[120px] bg-muted/10" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-muted/50">
            <FormField
              control={form.control}
              name="preferredContact"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Preferred Contact Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => { if (value) field.onChange(value); }}
                      value={field.value ?? ""}
                      aria-required="true"
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="email" />
                        </FormControl>
                        <FormLabel className="font-normal">Email</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="phone" />
                        </FormControl>
                        <FormLabel className="font-normal">Phone</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bestTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Best Time to Contact</FormLabel>
                  <Select onValueChange={(value) => { if (value) field.onChange(value); }} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger aria-required="true" className="bg-muted/10">
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="morning">Morning (9am - 12pm)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12pm - 3pm)</SelectItem>
                      <SelectItem value="late">Late Afternoon (3pm - 5pm)</SelectItem>
                      <SelectItem value="anytime">Anytime</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-14 mt-4" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
          {result && <p role={result.ok ? "status" : "alert"} className={`text-sm ${result.ok ? "text-[#0D6851]" : "text-destructive"}`}>{result.message}</p>}
          
          <p className="text-xs text-center text-foreground/50 mt-4">
            By submitting this form, you agree to our <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
          </p>
        </form>
      </Form>
    </div>
  );
}
